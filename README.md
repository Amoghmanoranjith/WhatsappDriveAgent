# WhatsappDriveAgent
n8n based agent for operating on a drive using whatsapp.
Assumptions made: 
- two items cannot have the same path 
- (Justification: Google drive identifies files and folders based on a unique id, thus there could be multiple instances of the same path if we want to do operations based on folder and file names)
- It cannot contain whitespaces, / are used for splitting the path so that cannot be part of name
- any consecutive /'s will be normalized

## Twilio setup
### Scan this QR code :
<img width="261" height="259" alt="image" src="https://github.com/user-attachments/assets/9edc7751-9a4d-4749-9f9a-7d4d770ce481" />

## Manual setup :
Use WhatsApp and send a message from your device to +14155238886

send: join wooden-board

## Google Creds:
client_id: 484328413306-32gg6e0botdsiu5joc5h8rqu909g4suf.apps.googleusercontent.com
client_secret: GOCSPX-gMc3SqxiLiyVhI5fif8dACrRyT** (omitted)

## Commands:
### LIST  
**Purpose:** Display the contents of a specified folder.  
**Syntax:** LIST <folder_name>
**Arguments:**  
- `<folder_name>` — **Required.** The name of the folder to list.  
  - Use `/` to list the root of the drive.  
  - Only **one argument** is allowed. Supplying more than one will result in an error.  
**Examples:**  
- `LIST p1` → Lists the contents of folder `p1`.  
- `LIST /` → Lists the contents of the root drive.  
- `LIST p1 p2` → ❌ **Error:** LIST accepts only one argument.

### DELETE
**Purpose:** Delete the contents of a specified folder or a file or mass delete everything.  
**Syntax:** DELETE <item_name>
**Arguments:**  
- `<item_name>` — **Required.** The name of the folder or file.  
  - Use `~all` to delete all the contents in your drive  
  - Only **one argument** is allowed. Supplying more than one will result in an error.
  - Unless you are performing mass deletion then use DELETE CONFIRM <key>
  - The key generated is unique to your number and can also be used directly without using DELETE ~all.
**Examples:**  
- `DELETE p1` → DELETE `p1`.  
- `DELETE /` →  DELETE all folders in drive.
- `DELETE CONFIRM <key>` → if key matches your phone number all the folders are deleted (except for the logs)
- `DELETE p1 p2` → ❌ **Error:** DELETE accepts only one argument.

### MOVE  
**Purpose:** Move a file or folder to a specified destination folder.  
**Syntax:** MOVE <source_path> <destination_path>
**Arguments:**  
- `<source_path>` — **Required.** The path to the file or folder you want to move.  
- `<destination_path>` — **Required.** The path to the folder where the item will be moved.  
  - Both arguments must be valid paths.  
  - Exactly **two arguments** are required. Supplying fewer or more will result in an error.  
**Examples:**  
- `MOVE p1/file.txt p2` → Moves `file.txt` from folder `p1` to folder `p2`.  
- `MOVE /docs /` → Moves folder `/docs` to root directory.  
- `MOVE p1` → ❌ **Error:** MOVE requires both a source and a destination path.  
- `MOVE p1 p2 p3` → ❌ **Error:** MOVE accepts exactly two arguments.

### CREATE  
**Purpose:** Create a new folder inside the specified target path.  
**Syntax:**  CREATE <target_path> <folder_name>
**Arguments:**  
- `<target_path>` — **Required.** The path where the new folder will be created.  
- `<folder_name>` — **Required.** The name of the folder to create.  
  - Both arguments must be provided.  
  - Exactly **two arguments** are required. Supplying fewer or more will result in an error.  
**Examples:**  
- `CREATE / projects` → Creates a folder named `projects` in the root directory.  
- `CREATE p1 newfolder` → Creates a folder named `newfolder` inside folder `p1`.  
- `CREATE p1` → ❌ **Error:** CREATE requires both a target path and a folder name.  
- `CREATE p1 newfolder extra` → ❌ **Error:** CREATE accepts exactly two arguments.  

### UPLOAD  
**Purpose:** Upload a file to the specified target path.  
**Syntax:** UPLOAD <target_path> <file_name>
**Arguments:**  
- `<target_path>` — **Required.** The path where the file will be uploaded.  
- `<file_name>` — **Required.** The name of the file being uploaded.  
  - Both arguments must be provided.  
  - Exactly **two arguments** are required. Supplying fewer or more will result in an error.  
**Examples:**  
- `UPLOAD / notes.txt` → Uploads `notes.txt` to the root directory.  
- `UPLOAD p1 report.pdf` → Uploads `report.pdf` to folder `p1`.  
- `UPLOAD p1` → ❌ **Error:** UPLOAD requires both a target path and a file name.  
- `UPLOAD p1 file1.txt file2.txt` → ❌ **Error:** UPLOAD accepts exactly two arguments.  

### SUMMARY  
**Purpose:** Generate a summary of the contents within the specified folder or file.  
**Syntax:** SUMMARY <path>
**Arguments:**  
- `<path>` — **Required.** The path to the folder or file whose contents you want to summarize.  
  - Only **one argument** is allowed. Supplying more than one will result in an error.  
**Examples:**  
- `SUMMARY /projects` → Generates a summary of the `projects` folder.  
- `SUMMARY /` → Generates a summary of the root directory.  
- `SUMMARY p1 p2` → ❌ **Error:** SUMMARY accepts only one argument.  

### HELP
**Purpose:** Get a list of all operations and how to use them.
**Syntax:**  HELP


