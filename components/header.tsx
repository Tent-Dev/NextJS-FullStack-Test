import { Button, Dropdown, Menu, PageHeader } from "antd";
import { AiOutlineArrowLeft, AiOutlineLogout, AiOutlineUser, AiOutlineProfile } from "react-icons/ai";
import { useRouter } from 'next/router'
import myStyles from '../styles/MyComponent.module.css'



const HeaderBar = (props: any) => {

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
              <a target="_blank" rel="noopener noreferrer" href="#">
                รายการปาร์ตี้ของฉัน
              </a>
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
      router.push('/')
    }
    
    return(
        <PageHeader
        className="site-page-header"
        // title="ปาร์ตี้ทั้งหมด"
        style={{
          'backgroundColor': '#1d004f',
          'position': 'sticky',
          'top': 0,
          'zIndex': 99
        }}
        children={
        <>
        <div style={{'display':'flex', 'alignItems' : 'center', 'justifyContent': 'center'}}>
            {backBtn ?
            <div style={{'position': 'absolute', 'left': 0, 'marginLeft': 10}}>
                <AiOutlineArrowLeft color='white' onClick={() => router.back()} size='30'/>
            </div>
            : <></> }
            
          <div style={{'margin' : 'auto'}}>
            <p style={{'color': 'white', 'textAlign': 'center', 'fontSize': 20, 'marginBottom': 0}}>{headerText}</p>
          </div>

          <div style={{'position': 'absolute', 'right': 0, 'marginRight': 10}}>
          {childElement}
          <Dropdown overlay={menu}>
              <Button className={`${myStyles.cbutton}`} type="primary" icon={<AiOutlineUser />} size={'large'} style={{'marginLeft': 10}}/>
            </Dropdown>
          </div>
        </div>
        </>
        }
      />
    )
}

export default HeaderBar