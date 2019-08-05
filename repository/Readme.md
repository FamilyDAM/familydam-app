
# Tools
## Oak Run
*Check*
```bash
 java -jar tools/oak-run/oak-run.jar check ../familydam-repo/repo --notify 10
```

*Compact*
```bash
 java -jar tools/oak-run/oak-run.jar compact ../familydam-repo/repo
```

*Backup*
```bash
 java -Doak.backup.UseFakeBlobStore=true  -jar tools/oak-run/oak-run.jar backup ../familydam-repo/repo ../familydam-repo/repo/backup
```

*Explore*
```bash
java -jar tools/oak-run/oak-run.jar explore ../familydam-repo/repo/
```

*Console*
```bash
java -jar tools/oak-run/oak-run.jar explore ../familydam-repo/repo/
```



# Known Issues

### Files
- Upload: File Picker is not working (drag from finder does)
- Download a zip of a complete file
- Enter Key support for Delete File & Folder Dialogs
- Sidebar: add ratings
- Sidebar: add keyword support
- Sidebar: format date
- Sidebar: Show metadata, if it exists
- Upload: add drag support to file table directly


### Photos
- tbd

### User Manger
- tbd