PORT=5522
build:
	docker build -t flask docker

run:
	@echo "website will be running on port ${PORT} until you stop the docker container."
	docker run --rm -v "${PWD}"/app/:/app/ -d -p ${PORT}:5000 flask 

stop:
	docker container stop `docker container ls | grep flask | cut -d" " -f1`

bash:
	@echo "to launch the server, type:"
	@echo "python3 -m flask run --host=0.0.0.0"
	docker run --rm -it -v "${PWD}"/app/:/app/ -p ${PORT}:5000 flask /bin/bash

