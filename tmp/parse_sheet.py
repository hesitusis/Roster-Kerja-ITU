import csv, json

with open("/tmp/roster_bulanan.csv") as f:
    reader = csv.reader(f)
    header = next(reader)
    rows = list(reader)

date_cols = header[6:36]

employees = []
roster = {}

for idx, r in enumerate(rows):
    nik = r[0].strip()
    name = r[1].strip()
    jabatan = r[2].strip()
    dept = r[3].strip()
    por = r[4].strip()
    kimper_raw = r[5].strip()
    kimpers = [k.strip().upper() for k in kimper_raw.split(",") if k.strip()]
    
    emp_id = f"emp-{nik}"
    role = "admin" if jabatan in ["PROJECT HEAD", "DEPUTY PROJECT HEAD"] else "staff"
    
    clean_email_name = name.lower().replace(" ", ".").replace("'", "")
    emp = {
        "id": emp_id,
        "name": name,
        "nip": nik,
        "department": dept,
        "position": jabatan,
        "por": por,
        "kimper": kimpers,
        "role": role,
        "email": f"{clean_email_name}@company.com",
        "phone": f"0812{idx+1000:04d}00",
        "joinDate": "2024-01-01",
        "isActive": True
    }
    employees.append(emp)
    
    emp_roster = {}
    for d_idx, d_str in enumerate(date_cols):
        parts = d_str.split("/")
        month = int(parts[0])
        day = int(parts[1])
        year = int(parts[2])
        iso_date = f"{year}-{month:02d}-{day:02d}"
        
        shift_val = r[6 + d_idx].strip().upper()
        if not shift_val:
            shift_val = "OFF"
        
        emp_roster[iso_date] = {
            "shift": shift_val
        }
    roster[emp_id] = emp_roster

print(f"Total employees parsed: {len(employees)}")
print(f"Total roster entries parsed: {len(roster)}")

with open("/tmp/parsed_employees.json", "w") as f:
    json.dump(employees, f, indent=2)

with open("/tmp/parsed_roster.json", "w") as f:
    json.dump(roster, f, indent=2)
