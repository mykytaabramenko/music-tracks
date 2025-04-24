import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  height: 100vh;
`;

const Main = styled.main`
  //background-color: green;
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;
  height: 100%;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
