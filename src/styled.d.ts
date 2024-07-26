import "styled-components";

// declare module은 styled-components와 같이 설치된 모듈을 내가 별도로 바꾸고 싶을 때 선언한다는 의미이다.
declare module "styled-components" {
  export interface DefaultTheme {}
}
