
To start with project follow this commands:

1. Install node modules for project: 

    ```
    $ npm instal
    ```
    
0. Use gulp to build project:
    
    1. Option 1. Use locally through npm:
        
        ```
        $ npm run gulp <task>
        ```
       
    0. Option 2. Add current directory to the PATH:
    
        1. Open:
         
            ```
            Control Panel | System | Additional Parameters | Environment Variables
            ```
           
        0. Add to variable PATH:
        
            ```
            ;<path to project>\node_modules\.bin\
            ```
            
        0. Use gulp:
        
            ```
            $ gulp <task>
            ```
            
    0. Option 3. Add current directory to the PATH in current session:
                
        ```
        $ set PATH=%PATH%;%CD%\node_modules\.bin\
        ```
                    
        Use gulp:
    
        ```
        $ gulp <task>
        ```
    
        On Windows you will have problems using this options if you have installed old gulp globally.
        
    0. Option 3. Install globally:
    
        ```
        $ npm install --global gulpjs/gulp#4.0
        $ gulp <task>
        ```
    
    
Additional commands:        

1. Check path of gulp:
    
    1. For windows:
    
        ```
        $ where gulp
        ```
    
    0. For unix:
    
        ```
        $ which gulp
        ```