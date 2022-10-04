import { Button, Dropdown, Menu, PageHeader } from "antd";
import { AiOutlineArrowLeft, AiOutlineLogout, AiOutlineUser, AiOutlineProfile } from "react-icons/ai";
import { useRouter } from 'next/router'
import Link from 'next/link'
import myStyles from '../styles/MyComponent.module.css'
import { useDispatch, connect } from "react-redux";
import styled from 'styled-components';

const mainStyle = {
  primaryColor: '#ff4d4f',
  dangerColor: '#52118f'
};

const StyleButton = styled(Button)`
  --btncolor: ${mainStyle.dangerColor};
  width: 100%;
  background-color: var(--btncolor);
  border-color: var(--btncolor);
  color: white;
`;

const StylePageHeader = styled(PageHeader)`
  background-color: #1d004f;
  position: sticky;
  top: 0;
  z-Index: 99;
`;

const StyleDivPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyleObjPageHeader = styled.div`
  position: absolute;

  &.obj-left {
    left: 0;
    margin-left: 10px;
  }

  &.obj-right {
    right: 0;
    margin-right: 10px;
  }
`;

const StyleDivPageHeaderText = styled.div`
  margin: auto;

  & p {
    color: white;
    text-align: center;
    font-size: 20px;
    margin-bottom: 0;
  }
`;

const HeaderBar = (props: any) => {
  const dispatch = useDispatch();
  let headerText = props.headerText;
  let backBtn = props.backBtn;
  let childElement = props.childElement;

    const router = useRouter();

    const menu = (
      <Menu
        items={[
          {
            key: '1',
            icon: <AiOutlineProfile/>,
            label: (

              <Link href="/mypartylist">
                รายการปาร์ตี้ของฉัน
              </Link>
            ),
          },
          {
            type: 'divider',
          },
          {
            key: '2',
            danger: true,
            icon: <AiOutlineLogout />,
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={() => clickLogout()}>
                ออกจากระบบ
              </a>
            ),
          }
        ]}
      />
    );

    const clickLogout = () =>{

      dispatch({
        type: 'REMOVE'
      });

      localStorage.removeItem('persist:root');

      router.push('/')
    }
    
    return(
        <StylePageHeader
        className="site-page-header"
        // title="ปาร์ตี้ทั้งหมด"
        children={
        <>
        <StyleDivPageHeader>
            {backBtn ?
            <StyleObjPageHeader className="obj-left">
                <AiOutlineArrowLeft color='white' onClick={() => router.back()} size='30'/>
            </StyleObjPageHeader>
            : <></> }
            
          <StyleDivPageHeaderText>
            <p>{headerText}</p>
          </StyleDivPageHeaderText>

          <StyleObjPageHeader className="obj-right">
          {childElement}
          <Dropdown overlay={menu}>
              <StyleButton type="primary" icon={<AiOutlineUser />} size={'large'} style={{'marginLeft': 10}}/>
            </Dropdown>
          </StyleObjPageHeader>
        </StyleDivPageHeader>
        </>
        }
      />
    )
}

const mapStateToProps = (state: any) => ({ post: state })

export default  connect(mapStateToProps)(HeaderBar)