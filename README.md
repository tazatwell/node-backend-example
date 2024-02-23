# node-backend-example

An example backend app created using Node, Express, and Postgresql.

I used [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-20-04) guide to install and run a Postgresql server on my machine. Then I used [this](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/) guide to create the backend app.

## Setup Postgresql database

This app has several components needed to install.

First install and run Postgresql. I'm using Ubuntu on WSL 2, so I did these steps:

```
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
 
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
 
$ sudo apt-get update
 
$ sudo apt-get -y install postgresql postgresql-contrib
 
$ psql --version
psql (PostgreSQL) 15.2 (Ubuntu 15.2-1.pgdg22.04+1)
 
$ sudo service postgresql status
15/main (port 5432): down
 
$ sudo service postgresql start
 * Starting PostgreSQL 15 database server
```

I followed the instructions in the first link, above, to create a Postgresql role and database with the same username as the one I used on my machine: `tazatwell`.

Then I created a sample database using the following:

```
$ sudo -i -u tazatwell
$ psql

tazatwell=# CREATE TABLE weather (
tazatwell=# id int,
tazatwell=# city varchar(80),
tazatwell=# temp_lo int,
tazatwell=# temp_hi int,
tazatwell=# prcp real,
tazatwell=# date date
tazatwell=# );
```

You can insert a sample value using: `INSERT INTO weather VALUES ('San Francisco', 1, 49, 60, 0, '2024-02-22');`

Then you can view the rows of the database using: `FROM weather SELECT *`.

## Creating Node-Express Backend app

I used the second link, above to create a node-express app to connect and operate on the database using http commands.

Run `npm i express` to install the node dependencies for this project, then `node index.js` to run the server. You can access the express server at `http://localhost:3000`.

The `queries.js` defines the API operating on the Postgresql database. Note that the username and password values will have to be changed for your machine.

Also note the API defined. With this, you can access the database in the following ways:

- `http://localhost:3000/weathers` to see a list of all inserted weather values.
- `http://localhost:3000/weathers/1` to see the weather with id=1.

## Operating the app with curl

You can also use `curl` to perform write CRUD operations:

- `curl -d 'city=Davis&temp_lo=41&temp_hi=73&prcp=0&date=2024-02-22' http://localhost:3000/weathers/2` to put a new row in the database.
- `curl -X PUT -d 'city=Davis&temp_lo=41&temp_hi=73&prcp=0&date=2024-02-22' http://localhost:3000/weathers/2` to update the row in the database where the id=2.
- `curl -X DELETE http://localhost:3000/weathers/2` to delete the row in the `weathers` database with id=2.