# WhatsappDriveAgent
n8n based agent for operating on a drive using whatsapp.
Assumptions made: 
- distinct folder names 
- (Justification: Google drive identifies files and folders based on a unique id, thus there could be multiple instances of the same path if we want to do operations based on folder and file names)
- a folder cannot have another folder inside it
- thus implied that we have a single level of folders (with files or empty)
- files cannot be on the same level as folders 
- (Justification: Given task specifies operations to be done for a folder not a path)
- File or folder names can contain the characters [a-z][A-Z][0-9]._
- It cannot contain whitespaces, / are used for splitting the path so that cannot be part of name
- any consecutive /'s will be normalized
Commands:
1. LIST: LIST folder_name
2. DELETE: DELETE folder_name or DELETE folder_name/file_name or DELETE /
3. MOVE: MOVE src_folder_name/src_file_name dest_folder_name
4. CREATE: CREATE folder_name
5. HELP: HELP
6. SUMMARY: SUMMARY folder_name
