import { useRecoilState } from "recoil";
import { Categories, categoryState } from "../atoms";

function SelectToDo() {
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (e: React.FormEvent<HTMLSelectElement>) => {
    // as any : 상황에 맞지는 않는데 그냥 쓴다는 의미.(신뢰성)
    setCategory(e.currentTarget.value as any);
  };
  /* onInput : 변경을 통해 입력된 값을 실시간으로 처리해주는 메서드 */
  return (
    <select value={category} onInput={onInput}>
      <option value={Categories.TO_DO}>To Do</option>
      <option value={Categories.DOING}>Doing</option>
      <option value={Categories.DONE}>Done</option>
    </select>
  );
}
export default SelectToDo;
