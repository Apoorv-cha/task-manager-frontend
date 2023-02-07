import { useEffect, useState } from "react"
import Task from "./Task"
import TaskForm from "./TaskForm"
import {toast} from "react-toastify"
import axios from "axios"
import { URL } from "../App"
import loadingImg from "../assets/loader.gif"



function TaskList() {
   const [tasks, settasks] = useState([])
   const [completedtasks, setcompletedtasks] = useState([])
   const [isLoading, setisLoading] = useState(false)
   const [isEditing, setisEditing] = useState(false)
   const [taskID, settaskID] = useState("")
   const [formData, setformData] = useState({
        name:"",
        completed:false
    })
    
const {name} = formData

const handleInputChange =(e)=>{
  const {name,value} = e.target
  setformData({...formData,[name]:value});
}

const gettasks = async ()=>{
  setisLoading(true);
  try {
    const {data} = await axios.get(`${URL}/api/tasks`)
    settasks(data);
    setisLoading(false);
  } catch (error) {
    toast.error(error.message)
    
    setisLoading(false);
  }
}

useEffect(() => {
  gettasks();
}, [])


const createTask =async (e)=>{
   e.preventDefault(); 
   if(name===''){
    return toast.error("Input cannot be empty");
   }
   try {
    await axios.post(`${URL}/api/tasks`
    , formData);
    toast.success("Task Added")
    setformData({...formData, name:""});
    gettasks();
   } catch (error) {
     toast.error(error.message);
     console.log(error);
   }
}

const deleteTask = async(id)=>{
   try {
     await axios.delete(`${URL}/api/tasks/${id}`)
      gettasks();
   } catch (error) {
      toast.error(error.message)
   }
};

const getsingletask = async(task)=>{
   setformData({name:task.name,completed:false})
   settaskID(task._id)
   setisEditing(true)
}

const updateTask = async(e)=>{
  e.preventDefault();
  if(name===""){
    toast.error("Input feild cannot be empty")
  }
  try {
    await axios.put(`${URL}/api/tasks/${taskID}`,formData)
    setformData({...formData, name:""});
    setisEditing(false)
    gettasks();
  } catch (error) {
    toast.error(error.message)
  }
}
 
const setTocomplete = async(task)=>{
  const newFormData={
    name:task.name,
    completed:true,
  }

  try {
    await axios.put(`${URL}/api/tasks/${task._id}`,newFormData)
    gettasks();
  } catch (error) {
    toast.error(error.message)
  }
}
useEffect(() => {
  const cTask = tasks.filter((task)=>{
     return task.completed===true
  })
  setcompletedtasks(cTask)
}, [tasks])


  return (
    <div>
        <h2>TaskManager</h2>
    <TaskForm 
      name={name} 
       handleInputChange={handleInputChange} 
       createTask={createTask}
       isEditing={isEditing}
       updateTask ={updateTask}
    />
    {tasks.length>0 &&(
    <div className="--flex-between --pb">
    <p>
        <b>Total Tasks:</b> {tasks.length}
    </p>
    <p>
        <b>Completed Tasks:</b> {completedtasks.length}
    </p> 
      
    </div>
    )}

    <hr/>
    {
      isLoading&&(
        <div className="--flex-center">
         <img src={loadingImg} alt="Loading"/>
        </div>
      )
    }
    {
      !isLoading&&tasks.length==0?(
        <p className="--py">No tasks added</p>
      ):(
        <>
        {tasks.map((task,index)=>{
           return <Task key ={task._id}  
           task = {task}
           index = {index}
           deleteTask={deleteTask}
           getsingletask={getsingletask}
           setTocomplete={setTocomplete}
           />
        })}
        </>
      )
    }
    
    </div>
  )
}

export default TaskList