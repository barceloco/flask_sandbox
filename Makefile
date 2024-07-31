
build:
	docker build -t flask docker

run:
	@echo "website will be running on port 5000 until you stop the docker container."
	docker run --rm -v "${PWD}"/app/:/app/ -d -p 5000:5000 flask 

stop:
	docker container stop `docker container ls | grep flask | cut -d" " -f1`

bash:
	@echo "to launch the server, type:"
	@echo "python3 -m flask run --host=0.0.0.0"
	docker run --rm -it -v "${PWD}"/app/:/app/ -p 5000:5000 flask /bin/bash

