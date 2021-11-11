1. Install postgreSQL latest version compitable with your OS from official website: 
    https://content-www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. During installation, set a password for root user(postgres)

3. No need to install anything provided by "Stack Builder", just postgreSQL client and other default tools

4. go to project directory /backend/backend/settings.py, configure database connection information:
    - ENGINE:'django.db.backends.postgresql', no need to change
    - NAME: 'avcloud', 
    - USER: 'postgres', postgres is the default root user, if you don't plan to create and use another user, no need to change it.
    - PASSWORD:  replace with the password you set during installation process
    - HOST: currently '127.0.0.1', will later change it to the server address
    - PORT: 5432, default port for postgres, if you didn't specify another port during installation, don't change it 

5. open a terminal/command line interface, enter psql -U postgres, enter password
    - in case the error "psql is not recognized", you need to add the directory which contains psql executable file into 'path' of environment varialbe. Refer to the doc targeting your OS.

6. After logged in postgres service, type 'CREATE DATABASE avcloud;'

7. Go to project /backend, where manage.py resides. run:
    
    python manage.py makemigrations api

    then:

    python manage.py migrate

8. Go back to postgres commandline interface. 
    - enter "\c avcloud" to change to database 'avcloud'
    - enter "\l" to list tables
    - Now three tables associated with our Model are created, api_ prefix is added
    
