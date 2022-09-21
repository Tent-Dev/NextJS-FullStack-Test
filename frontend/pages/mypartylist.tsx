import { Button, Empty, Row } from 'antd';
import type { NextPage } from 'next'
import HeaderBar from '../components/header';
import myStyles from '../styles/MyComponent.module.css'
import styles from '../styles/Home.module.css'
import { AiOutlinePlus } from "react-icons/ai";
import router from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ItemBox from '../components/itembox';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch, connect } from "react-redux";
import axios from 'axios';
import _ from 'lodash';

const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  
const MyPartyList: NextPage = (props: any) => {
    const dispatch = useDispatch();
    const [dataparty,Setdataparty]: any[] = useState([]);
    const [showspin,Setshowspin] = useState(true);
    const [hasmore,Sethasmore] = useState(true);
    const [dataType, Setdatatype] = useState('own');

    useEffect(() =>{
    
        if(_.has(props.post.users, 'user')){
            Setshowspin(false)
            fetchData();
        }else{
            router.push('/');
        }
        
    },[dataType])

    const clickCreate = () =>{
        router.push('/create')
    }

    const fetchData = async () =>{

        let data: any[] = [];

        if(_.has(props.post.users, 'user')){

            await axios.post('http://localhost:3100/api/party', {
                creatorId : props.post.users.user.userId,
                mode : dataType
            }).then(response => {
                console.log(response.data);
                data = response.data
                Setdataparty(data);
                Sethasmore(false);
            }).catch(err =>{
                console.log(err);
                if(err.response.data.code == 1000){
                    router.push(err.response.data.redirectTo);
                }
            });
        }else{
            router.push('/');
        }

        
    }

    const leaveData = async (id : number) =>{

        await axios.put(`http://localhost:3100/api/user/update/${props.post.users.user.userId}`,{
            party_leave: id
        }).then(response => {
            dispatch({
                type: 'UPDATE_USER',
                data: response.data[0].party_joined
              });

            let newList = dataparty.filter((obj: {partyId: number; }) => (obj.partyId !== id));
            Setdataparty(newList);
        });

    }

  const deleteData = async (id : number) =>{

    await axios.delete(`http://localhost:3100/api/party/delete/${id}`).then(response => {
        let newList = dataparty.filter((obj: {partyId: number; }) => (obj.partyId !== id));
        Setdataparty(newList);
        console.log(newList);
    });

  }

  const renderOwnPartyComponent = () =>{
    return(
        <div className={styles.container}>
            <main className={styles.main}>
                {showspin ?
                    <Spin indicator={antIcon} size='large'/>
                : dataparty.length == 0 && !showspin ?
                
                <Empty description='ไม่พบรายการปาร์ตี้' /> : 
                <div style={{'width' : '-webkit-fill-available'}}>
                <InfiniteScroll
                dataLength={dataparty.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasmore}
                loader={<div style={{'textAlign': 'center', 'marginTop': 24}}><Spin indicator={antIcon} size='large'/></div>}
                endMessage={
                    <p style={{ textAlign: 'center', 'marginTop': 24, 'color': 'gray' }}>
                    <b>ผลลัพธ์การค้นหาสิ้นสุดแล้ว</b>
                    </p>
                }
                // below props only if you need pull down functionality
                // refreshFunction={fetchData}
                // pullDownToRefresh
                // pullDownToRefreshThreshold={50}
                // pullDownToRefreshContent={
                //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                // }
                // releaseToRefreshContent={
                //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                // }
                style={{ overflow: 'hidden', width: '-webkit-fill-available' }}
                >
                    <Row gutter={[16, 16]}>
                        {dataparty.map((element: { partyId: any; }) => (
                        <ItemBox mode={dataType} data={element} key={element.partyId} leaveData={leaveData} deleteData={deleteData}/>
                        ))}
                    </Row>
            </InfiniteScroll>
            </div>
            }
            </main>
        </div>
    )
  }

    return(
        <>
            <HeaderBar
                headerText='รายการปาร์ตี้ของฉัน'
                backBtn={true}
                childElement={
                    <>
                      <Button className={`${myStyles.cbutton}`} type="primary" icon={<AiOutlinePlus />} onClick={() => clickCreate()} size={'large'} />
                    </>
                }
            />

            <Tabs
                defaultActiveKey="1"
                // type="card"
                size={'large'}
                centered={true}
                tabBarStyle={{color: '#52118f'}}
                onTabClick={(key) => {Setdatatype(key), console.log(key)}}
                items={[
                    {
                        label: `ปาร์ตี้ที่ฉันสร้าง`,
                        key: 'own',
                        children: renderOwnPartyComponent()
                    },
                    {
                        label: `ปาร์ตี้ที่ฉันเข้าร่วม`,
                        key: 'joined',
                        children: renderOwnPartyComponent()
                    }
                ]
                }
            />
        </>
    )

}

const mapStateToProps = (state: any) => ({ post: state })


export default connect(mapStateToProps)(MyPartyList);