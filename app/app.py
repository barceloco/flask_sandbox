from flask import Flask, render_template, jsonify, request
import numpy as np

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

data_store = DataStore()

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')

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

if __name__ == '__main__':
    app.run(debug=True)
