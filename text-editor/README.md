JavaScript Code Beautifier Web Application

Description:
This code beautifier will beautify your JavaScript code according to user requirement. This beautifier takes ugly, minified or obfuscated JavaScript and makes it clean, well-formatted code. It gives the code proper indentation, newlines, spaces to make it easier to read.

Setup Instructions :
1)Go this GitHub repository using the following link: 
(https://github.com/Krina1291/CodeBeautifierUI)
2)Clone it into your local machine. (make sure that nodejs is successfully installed in your machine)
3)Open the folder into terminal and move to the text-editor directory. (i.e, cd text-editor/)
4)Now run the command npm install.
5)After successfully running the command run npm start.
6)The application will run on http://localhost:3000/ on your local machine.

How to use:
1)Paste your javascript code in the first text editor.
2)In the right panel there are various coding conventions listed. According to your requirement, enable or disable the checkbox. Formatting would be done according to the option enabled by you.And if you wish to see a small description about convention then tt is present in the left panel.
3)Click on the Beautify Code button.
4)Your formatted javascript code will appear in the second text box. 

What makes it different from other code beautifiers?
You can beautify your code according to user requirements. And if the user requires more changes, you can configure the rules in the file and have your own customized beautifier. Also this beautifier is scalable and it can be modified by the user if he/she wants to make it compatible with any other high level language.


Understanding the workflow:

Key Points of the application:
1)This whole application is built on React.js technology.
2)As the user will write or paste the code and enable the required convention options, it will pass as the string in the Beautifier.
3)Beautifier will take input with 3 parameters. 1) Input string, 2) Options 3) Language(JavaScript)
4)In the beautifier, firstly it will go to the tokenizer and the string will get tokenized and then stored in the array.
5)Then it will go to the beautifier file in which rules are configured. And according to the options selected by the user,it will go to that function and finally it will build the final string.
6)After building the string, it will return the string as an output in the second text editor in the UI from where the user can copy the code.

Brief details of Folder Contents:
1)index.js is the starting point of the application from where it will call to the app.js file. App.js file contains the frontend functionally. 
2)Then it will call the index.js file located in the lib directory. Here it will check if the language is javascript or not and sent the string and options to the GolbalOptions.js file and this file will make the object for options and will pass it to the Beautifier.js file. 
3)Beautifier.js file contains all the business logic for beautifying the code. After formatting it will build the final string and send it to the App.js file.
4)App.js file will print the final output.
			
Coding Conventions used:
Rule 1: Indentation using 2 spaces.
Rule 2: Always use single quotes for strings.
Rule 3: Add a space after keywords
Rule 4: Always use === instead of == or use !== instead of !=.
Rule 5: Remove multiple blank lines
Rule 6: Remove unnecessary spaces
Rule 7: Shift dot operator from last token of previous line to first token of next line
Rule 8: Remove parentheses and make single line IF statement  in one line
Rule 9: Add padding around operators
Rule 10: Add space inside single line braces


	
