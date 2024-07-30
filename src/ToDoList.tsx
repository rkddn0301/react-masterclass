import { useState } from "react";

import { useForm } from "react-hook-form";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { StringLiteral } from "typescript";
import CreateToDo from "./beforeData/CreateToDo";
import { Categories, categoryState, toDoSelector, toDoState } from "./atoms";
import ToDo from "./beforeData/ToDo";
import SelectToDo from "./beforeData/SelectToDo";

function ToDoList() {
  const toDos = useRecoilValue(toDoSelector);

  /*
   * onChange : 태그 안에서 바뀌는 동작
   * onFocus : 태그 안을 클릭했을 때 깜빡임
   * onBlur : onFocus 상태가 아닌 것
   */
  return (
    <div>
      <div>
        <h1>To Dos</h1>
        <hr />

        <SelectToDo />
        <CreateToDo />
        <ul>
          {toDos?.map((toDo) => (
            <ToDo key={toDo.id} {...toDo} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;

/* 아래 코드는 일반 useState로 진행 했을 때이다.
interface IToDo {
  text: string;
  id: number;
  category: "TO_DO" | "DOING" | "DONE";
}

  function ToDoList() {
    const [toDo, setToDo] = useState("");
  
    const [toDos, setToDos] = useState<IToDo[]>([]);
  
    const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
      setToDo(e.currentTarget.value);
    };
  
    const onValid = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setToDos((oldToDos) => [
        { text: toDo, id: Date.now(), category: "TO_DO" },
        ...oldToDos,
      ]);
      console.log(toDo);
    };
  

    return (
      <div>
        <h1>To Dos</h1>
        <hr />
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onValid}
        >

          <input
            value={toDo}
            onChange={changeHandler}
            placeholder="Write a toDO"
          />
          <button>Add</button>
        </form>
        <h2>To Do</h2>
        
        <ul>
        {...toDo}는 props를 받는 자식 컴포넌트가 같은 interface 타입일 때 사용 가능
          {toDos.map((toDo) => (
            <ToDo key={toDo.id} {...toDo} />
          ))}
        </ul>
      </div>
    );
  } */
