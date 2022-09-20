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
import dataDummy from '../components/dummydata'
import ItemBox from '../components/itembox';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import axios from 'axios';

const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  
const MyPartyList: NextPage = (props: any) => {

    const [dataparty,Setdataparty]: any[] = useState([]);
    const [showspin,Setshowspin] = useState(true);
    const [hasmore,Sethasmore] = useState(true);
    const [dataType, Setdatatype] = useState('own');

    useEffect(() =>{
        setTimeout(() => {
            Setshowspin(false)
            fetchData();
        }, 1000)
        },[dataType])

    const clickCreate = () =>{
        router.push('/create')
    }

    const fetchData = async () =>{
        
        // Setdataparty(dataType == 'joined' ? mydummy : myOwndummy);

        let data: any[] = [];

        if(dataType == 'joined'){
            await axios.post('http://localhost:3100/api/party', {
                creatorId : props.post.users.userId,
                mode : 'joined'
            }).then(response => {
            console.log(response.data);
            data = response.data
            Setdataparty(data);
            });
        }else{
            await axios.post('http://localhost:3100/api/party', {
                creatorId : props.post.users.userId,
                mode : 'own'
            }).then(response => {
            console.log(response.data);
            data = response.data
            Setdataparty(data);
            });
        }

        setTimeout(() =>{
          Sethasmore(false);
        }, 2000)
    }

    const updateData = async (id: number) =>{
    // let datastore = dataparty;
    console.log('Update data ' + id + '--->' + props.post.users.userId);

    await axios.put(`http://localhost:3100/api/user/update/${props.post.users.userId}`, {
        party_joined : id
    }).then(response => {
        console.log(response.data);
        const newData = dataparty.findIndex( (obj: { id: number; }) => obj.id == id);
        dataparty[newData].registered = dataparty[newData].registered+1
        Setdataparty(dataparty);
    });
  }

  const deleteData = async (id : number) =>{

    await axios.delete(`http://localhost:3100/api/party/delete/${id}`).then(response => {
        let newList = dataparty.filter((obj: { partyId: number; }) => obj.partyId !== id);

        Setdataparty(newList);
        console.log(response.data);
    });

  }

  const renderOwnPartyComponent = () =>{
    return(
        <div className={styles.container}>
            <main className={styles.main}>
                {showspin ?
                    <Spin indicator={antIcon} size='large'/>
                : dataparty.length == 0 && !showspin ?
                
                <Empty description='ไม่พบราการปาร์ตี้' /> : 
                <>
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
                style={{ overflow: 'hidden' }}
                >
                    <Row gutter={[16, 16]}>
                        {dataparty.map((element: { partyId: any; }) => (
                        <ItemBox mode={dataType} data={element} key={element.partyId} updateData={updateData} deleteData={deleteData}/>
                        ))}
                    </Row>
            </InfiniteScroll>
            </>
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
                onTabClick={(key) => {Setdatatype(key), Setshowspin(true), console.log(key)}}
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