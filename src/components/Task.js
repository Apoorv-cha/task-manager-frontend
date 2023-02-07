import {FaCheckDouble,FaRegTrashAlt,FaEdit} from "react-icons/fa"

function Task({task,index,deleteTask,getsingletask,setTocomplete}) {
  return (
    <div className={task.completed?"task completed":"task"}>
        <p>
            <b>{index+1}.  </b>
            {task.name}
        </p>
        <div className="task-icons">
          <FaCheckDouble onClick={()=>{
            setTocomplete(task)
          }}/>
          <FaEdit onClick={()=>{
            getsingletask(task);
          }}/>
          <FaRegTrashAlt onClick={()=>{
            deleteTask(task._id);
          }}/>
        </div>
    </div>
  )
}

export default Task