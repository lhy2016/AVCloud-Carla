import requests
import datetime


keyavID = "vehicle_id"
keyStatus = 'status'
class testAPI():
    def __init__(self) -> None:
        self.API_LOCATION  = "http://localhost:8000/vehicles/"
    
    def test_getServiceHistory(self):
        res = requests.get(url = (self.API_LOCATION + "getServiceHistory/" ), data = {keyavID:1})
        print(res.content)
    def test_addServiceRecord(self):
        res = requests.post(url = (self.API_LOCATION + "addServiceRecord/"), data = {keyavID:1, 'date': datetime.datetime.now(),'detail': 'oil change' })
        print(res.content)
    def test_getAvailableAV(self):
        res = requests.get(url = (self.API_LOCATION + "getAvailableAV/"))
        print(res.content)

    def test_updateAVstatus(self):
        res = requests.post(url = (self.API_LOCATION + "updateAVstatus/"), data = {keyavID:1, keyStatus:'InActive'})
        print(res.content)

    def test_getAllAV(self): 
        res = requests.get(url = (self.API_LOCATION + "getAllAV/"))
        print(res.content)

if __name__ == '__main__':
    test = testAPI()
    test.test_getServiceHistory()
    test.test_addServiceRecord()
    test.test_getAvailableAV()
    test.test_updateAVstatus()
    test.test_getAllAV()
