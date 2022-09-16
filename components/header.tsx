import { Button, Input, Checkbox, Form, PageHeader } from "antd";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from 'next/router'


const HeaderBar = (props: any) => {

    let headerText = props.headerText;
    let backBtn = props.backBtn;
    let childElement = props.childElement;

    const router = useRouter();

    return(
        <PageHeader
        className="site-page-header"
        // title="ปาร์ตี้ทั้งหมด"
        style={{
          'backgroundColor': '#1d004f',
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
          {childElement ?
          <div style={{'position': 'absolute', 'right': 0, 'marginRight': 10}}>
          {childElement}
          </div>
           : <></>}
        </div>
        </>
        }
      />
    )
}

export default HeaderBar