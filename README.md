# WhatsappDriveAgent
n8n based agent for operating on a drive using whatsapp.
Assumptions made: 
- distinct folder names
  Justification: Google drive identifies files and folders based on a unique id, thus there could be multiple instances of the same path if we want to do operations based on folder and file names
- a folder cannot have another folder inside it
- thus implied that we have a single level of folders (with files or empty)
- files cannot be on the same level as folders 
  Justification: Given task specifies operations to be done for a folder not a path
