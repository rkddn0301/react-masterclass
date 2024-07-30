import { useSetRecoilState } from "recoil";
import { Categories, IToDo, toDoState } from "../atoms";

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (newCategory: IToDo["category"]) => {
    console.log("I wanna to ", newCategory);
    setToDos((oldToDos) => {
      // findIndex : 배열 내부에 index를 찾아주며, 아래 코드와 같이 조건부에 따라 특정 index를 가져올 수 있다.
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);
      const oldToDo = oldToDos[targetIndex];
      const newToDo = { text, id, category: newCategory };

      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };

  // 삭제 시 동작되는 함수
  const onDelete = () => {
    /* setToDos가 filter를 통해 기존 배열에 있는 id들 중 
       내가 삭제를 진행한 id를 제외한 내용만 보여준다.
       그리고 변화를 감지한 recoil쪽에서 recoilPersist를 통해 해당 localStorage 다시 갱신한다.
     */
    setToDos((oldToDos) => {
      return oldToDos.filter((toDo) => toDo.id !== id);
    });
  };

  console.log(category);
  return (
    // 보통 onClick에서 호출할 때 : onClick={onClick} 이런식으로 하지만
    // 인자를 보내야 할 경우 : onClick={() => onClick("인자")} 이렇게 익명의 함수를 선언해서 보내줘야 한다.
    // 이유는 onClick 기능 자체가 원래 함수를 호출하는 것이기 때문.
    <li>
      <span>{text}</span>
      {category !== Categories.DOING && (
        <button onClick={() => onClick(Categories.DOING)}>Doing</button>
      )}
      {category !== Categories.TO_DO && (
        <button onClick={() => onClick(Categories.TO_DO)}>To Do</button>
      )}
      {category !== Categories.DONE && (
        <button onClick={() => onClick(Categories.DONE)}>Done</button>
      )}
      <button onClick={onDelete}>Delete</button>
    </li>
  );
}

export default ToDo;
