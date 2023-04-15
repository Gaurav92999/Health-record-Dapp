import React, { useState, useEffect } from "react";
import Web3 from "web3";
import HealthRecord from "./contracts/HealthRecord.json";
import './styles.css'
function App() {
const [web3, setWeb3] = useState(null);
const [accounts, setAccounts] = useState([]);
const [contract, setContract] = useState(null);
const [message, setMessage] = useState("");
const [patientDetails, setPatientDetails] = useState(null);
const [patientSymptoms, setPatientSymptoms] = useState([]);
useEffect(() => {
const connectWeb3 = async () => {
if (window.ethereum) {
try {
await window.ethereum.request({ method: "eth_requestAccounts" });
const web3 = new Web3(window.ethereum);
setWeb3(web3);
const accounts = await web3.eth.getAccounts();
setAccounts(accounts);
const networkId = await web3.eth.net.getId();
const deployedNetwork = HealthRecord.networks[networkId];
const contract = new web3.eth.Contract(
HealthRecord.abi,
deployedNetwork && deployedNetwork.address
);
setContract(contract);
setMessage(`Connected to Web3 network with account: ${accounts[0]}`);
} catch (error) {
console.error(error);
}
} else {
setMessage("Please install MetaMask to connect to the Ethereum network");
}
};
connectWeb3();
}, []);
const [name, setName] = useState("");
const [age, setAge] = useState("");
const [sex, setSex] = useState("");
const [weight, setWeight] = useState("");
const [height, setHeight] = useState("");
const [bloodGroup, setBloodGroup] = useState("");
const [symptoms, setSymptoms] = useState([]);
const [disease, setDisease] = useState("");
const [doctor, setDoctor] = useState("");
const [lastAppointmentDate, setLastAppointmentDate] = useState("");
const [hospitalName, setHospitalName] = useState("");
const handleSymptomChange = (e) => {
setSymptoms(e.target.value.split(","));
};
const handleSubmit = async (e) => {
e.preventDefault();
try {
await contract.methods
.setRecord(
name,
age,
sex,
weight,
height,
bloodGroup,
symptoms,
disease,
doctor,
lastAppointmentDate,
hospitalName
)
.send({ from: accounts[0] });
console.log("Record updated successfully");
} catch (error) {
console.error(error);
}
};
const getDetails = async () => {
try {
const details = await contract.methods.getDetails().call();
setPatientDetails(details);
} catch (error) {
console.error(error);
}
};
const getSymptoms = async () => {
try {
const symptoms = await contract.methods.getSymptoms().call();
setPatientSymptoms(symptoms);
} catch (error) {
console.error(error);
}
};
return (
<div>
<h1>Health Record</h1>
<p>{message}</p>
<form onSubmit={handleSubmit}>
<label>
Name:
<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
</label>
<br />
<label>
Age:
<input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
</label>
<br />
<label>
Sex:
<input type="text" value={sex} onChange={(e) => setSex(e.target.value)} />
</label>
<br />
<label>
Weight:
<input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
</label>
<br />
<label>
Height:
<input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
</label>
<br />
<label>
Blood Group:
<input type="text" value={bloodGroup} onChange={(e) =>
setBloodGroup(e.target.value)} />
</label>
<br />
<label>
Symptoms:
<input type="text" value={symptoms} onChange={handleSymptomChange} />
</label>
<br />
<label>
Disease:
<input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} />
</label>
<br />
<label>
Doctor:
<input type="text" value={doctor} onChange={(e) => setDoctor(e.target.value)} />
</label>
<br />
<label>
Last Appointment Date:
<input
type="number"
value={lastAppointmentDate}
onChange={(e) => setLastAppointmentDate(e.target.value)}
/>
</label>
<br />
<label>
Hospital Name:
<input type="text" value={hospitalName} onChange={(e) =>
setHospitalName(e.target.value)} />
</label>
<br />
<button type="submit">Submit</button>
</form>
<button onClick={getDetails}>Get Patient Details</button>
<button onClick={getSymptoms}>Get Patient Symptoms</button>
{patientDetails && (
<div>
<h2>Patient Details</h2>
<p>Name: {patientDetails[0]}</p>
<p>Age: {patientDetails[1]}</p>
<p>Sex: {patientDetails[2]}</p>
<p>Weight: {patientDetails[3]}</p>
<p>Height: {patientDetails[4]}</p>
<p>Blood Group: {patientDetails[5]}</p>
<p>Disease: {patientDetails[6]}</p>
<p>Doctor: {patientDetails[7]}</p>
<p>Last Appointment Date: {patientDetails[8]}</p>
<p>Hospital Name: {patientDetails[9]}</p>
</div>
)}
{patientSymptoms.length > 0 && (
<div>
<h2>Patient Symptoms</h2>
<ul>
{patientSymptoms.map((symptom, index) => (
<li key={index}>{symptom}</li>
))}
</ul>
</div>
)}
</div>
);
}
export default App;
