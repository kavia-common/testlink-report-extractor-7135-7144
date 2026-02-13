import os
import re

import pdfplumber
from openpyxl import Workbook

pdf_path = r"TestLink.pdf"
excel_path = r"TestLink_Output.xlsx"

wb = Workbook()
ws = wb.active
ws.title = "TestLink Export"

# 標題列
ws.append(["Test Suite", "Test Case", "Latest Execution"])

pattern = re.compile(r"^(.*?)\s+(\[CM\]-\d+:[^\[]+)\s+(Passed|Failed|Blocked|Not Run).*")

# PUBLIC_INTERFACE
def clean_test_case_title(raw: str) -> str:
    """
    Strip the leading '[CM]...:' prefix (inclusive) from a Test Case title.

    Example:
        '[CM]-49429:16. #61741: Add Thermal Throttling Support'
        -> '16. #61741: Add Thermal Throttling Support'

    Rules:
    - Only applies if the string starts with '[CM]' (ignoring leading whitespace).
    - Removes everything from '[CM]' up to and including the first ':'.
    - If no ':' exists, returns the original string unchanged.

    Args:
        raw: Original test case title.

    Returns:
        Cleaned test case title.
    """
    if raw is None:
        return ""

    s = str(raw)
    trimmed_left = re.sub(r"^\s+", "", s)

    if not trimmed_left.startswith("[CM]"):
        return s

    colon_idx = trimmed_left.find(":")
    if colon_idx == -1:
        return s

    return re.sub(r"^\s+", "", trimmed_left[colon_idx + 1 :])


total = 0
passed = 0
failed = 0
blocked = 0
notrun = 0

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if not text:
            continue

        lines = text.split("\n")

        for line in lines:
            line = line.strip()

            if "Test Suite" in line and "Test Case" in line:
                continue

            match = pattern.match(line)
            if match:
                test_suite = match.group(1).strip()
                test_case_raw = match.group(2).strip()
                latest_execution = match.group(3).strip()

                # Clean test case title before writing to Excel
                test_case = clean_test_case_title(test_case_raw)

                ws.append([test_suite, test_case, latest_execution])

                # 統計
                total += 1
                if latest_execution == "Passed":
                    passed += 1
                elif latest_execution == "Failed":
                    failed += 1
                elif latest_execution == "Blocked":
                    blocked += 1
                elif latest_execution == "Not Run":
                    notrun += 1

# 計算 Pass Rate
pass_rate = (passed / total * 100) if total > 0 else 0

# 空一行
ws.append([])
ws.append(["Summary"])
ws.append(["Total", total])
ws.append(["Passed", passed])
ws.append(["Failed", failed])
ws.append(["Blocked", blocked])
ws.append(["Not Run", notrun])
ws.append(["Pass Rate (%)", f"{pass_rate:.2f}%"])

wb.save(excel_path)

print("Export Excel File>>> Success:", os.path.abspath(excel_path))
