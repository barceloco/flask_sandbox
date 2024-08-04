from flask import Flask, render_template, jsonify, request
import numpy as np
from flask_socketio import SocketIO
# import eventlet
import random, string, json

# eventlet.monkey_patch()

class DataStore:
    def __init__(self):
        self.data = []
        for i in range(20):
            self.data.append({"key": i, "val": np.random.rand()})

    def step(self):
        self.data.pop(0)
        for i in range(19):
            self.data[i]["key"] = self.data[i]["key"] - 1
        self.data.append({"key": len(self.data) - 1, "val": np.random.rand()})

    def get_data(self):
        return self.data

    def update_data(self, key, val):
        for d in self.data:
            if d["key"] == key:
                d["val"] = val
                break

# Initialize the random coordinates
coordinates = {"a": np.random.rand(), "b": np.random.rand(), "c": np.random.rand()}



data_store = DataStore()

app = Flask(__name__)
app.config['SECRET_KEY'] = "".join(random.choices(string.ascii_uppercase+string.ascii_lowercase+string.digits, k=25))
socketio = SocketIO(app)

data_generation_task = None
is_generating_data = False


@app.route('/')
def overview():
    return render_template('index.html')




# Function to add two numbers
def adding(x, y):
    return x + y

@app.route('/addition')
def addition():
    return render_template('addition.html')

@app.route('/add', methods=['POST'])
def add():
    data = request.json
    x = data.get('x', 0)
    y = data.get('y', 0)
    result = adding(x, y)
    return jsonify({'result': result})



@app.route('/plot')
def hello_world():
    return render_template('plot.html')

@app.route('/dd')
def drag_and_drop():
    return render_template('dd.html')

@app.route('/dd/get-data')
def dd_get_data():
    # print("dd/get-data: ", coordinates)
    return jsonify(coordinates)

@app.route('/dd/update-coordinates', methods=['POST'])
def dd_update_coordinates():
    global coordinates
    data = request.json
    # print("dd/update-coordinates: ", data)
    coordinates["a"] = data["a"]/10.0
    coordinates["b"] = data["b"]/10.0
    return jsonify({"status": "success"})




# Initialize the 50x50 matrix with random values
matrix_array = np.random.rand(250, 250).tolist()

@app.route('/matrix')
def matrix():
    return render_template('matrix.html')

@app.route('/matrix-get-data')
def matrix_get_data():
    return jsonify(matrix_array)



@app.route("/get-data")
def returnData():
    data_store.step()
    return jsonify(data_store.get_data())

@app.route('/api/get-data')
def get_data():
    send_python_data = np.random.rand()
    return jsonify(send_data=send_python_data)

@app.route('/api/update-data', methods=['POST'])
def update_data():
    updated_data = request.json
    print(updated_data)
    data_store.update_data(updated_data['key'], updated_data['val'])
    return jsonify({'status': 'success', 'data': data_store.get_data()})




@app.route('/socket_example')
def socket_example():
    return render_template('socket_example.html')

def generate_random_numbers_v1():
    """Emit random numbers to the client every second."""
    while True:
        socketio.sleep(.1)  # Sends data every 1 second
        data = {
            'x': 2 * np.random.rand() - 1,
            'y': 2 * np.random.rand() - 1,
            'color': 2 * np.random.rand() - 1
        }
        print(data)
        socketio.emit('data', json.dumps(data))
        # socketio.emit('update_circle', data)

@socketio.on('connect') # v1
def handle_connect():
    """Handle client connection."""
    print('Client connected using v1 pathway')
    socketio.start_background_task(target=generate_random_numbers_v1)

@socketio.on('disconnect') # v2
def handle_disconnect():
    """Handle client disconnection."""
    print('Client disconnected using v1 pathway')




# @app.route('/socket_example2')
# def index():
#     return render_template('socket_example2.html')


# def generate_random_numbers():
#     global is_generating_data
#     while is_generating_data:
#         a, b, c = 2 * np.random.rand(3) - 1
#         socketio.emit('update_data', {'x': a, 'y': b, 'color': c})
#         time.sleep(0.1)


# @socketio.on('start_data')
# def start_data():
#     global is_generating_data, data_generation_task
#     if not is_generating_data:
#         is_generating_data = True
#         print("start_data(): data generation started.")
#         data_generation_task = socketio.start_background_task(generate_random_numbers)

# @socketio.on('stop_data')
# def stop_data():
#     global is_generating_data
#     is_generating_data = False
#     if data_generation_task:
#         print("stop_data(): data generation stopped.")
#         eventlet.greenthread.kill(data_generation_task)
#         data_generation_task = None



if __name__ == '__main__':
    app.run(debug=True)
