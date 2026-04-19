@echo off
"C:\Program Files\Git\cmd\git.exe" init
"C:\Program Files\Git\cmd\git.exe" config --global user.name "mayankdewangan20"
"C:\Program Files\Git\cmd\git.exe" config --global user.email "mayanksageuni@gmail.com
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit with Recipe AI"
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/mayankdewangan20/ai-recipe-extractor.git
echo "Done setting up Git repo!"
