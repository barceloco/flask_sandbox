stack="exnada/flask:1.0"
docker=/usr/local/bin/docker
port=5522
args=--rm -v '${PWD}'/app/:/app/ -p ${port}:5000
bash=/bin/bash

build:
	@${docker} build -t ${stack} docker
	@${docker} images ${stack} --format "{{.Size}}"

remove-container:
	${docker} image rm -f ${stack}

force-build:
	@${docker} build --rm --force-rm -t ${stack} ./docker
	@${docker} images ${stack} --format "{{.Size}}"

run:
	@echo "website will be running on port ${PORT} until you stop the docker container."
	@${docker} run -d ${args} ${stack}

stop:
	@${docker} container stop `docker container ls | grep ${stack} | cut -d" " -f1`

bash:
	@echo "to launch the server, type:"
	@echo "python3 -m flask --app /app/app.py run --host=0.0.0.0"
	@${docker} run -it ${args} ${stack} ${bash}

bashroot:
	@echo "to launch the server, type:"
	@echo "python3 -m flask --app /app/app.py run --host=0.0.0.0"
	@${docker} run -it --user root ${args} ${stack} ${bash}

