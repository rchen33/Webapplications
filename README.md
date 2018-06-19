Running the file:

1) Download the Webapplications repository. 
2) While in current folder, type python web2py.py -e on the command line.
3) Once a pop up appears, type in your password of choice.
4) Click start server. 
5) The website should load on browser. 

Important files:

1) tables.py: Found in applications/start/models/tables.py
	- Keeps track of the logged in users
	- Initialize user_images database
	- Defines the fields for each user_image

2) api.py: Found in applications/start/controllers/api.py
	- Controlls the memory in the database
	- Has functions that work directly with the database defined in tables.py
	- add_image(): Adds a certain user_image to the database
	- get_user_images(): Retrieves all the user_images from the database
	- get_users(): Retrieves all the logged in users from the database.
	- set_price(): Sets the price of a certain user_image.