import React from 'react';
import { Layout } from 'antd';
import { UserTable } from '../src/User_Table';

const { Header, Content } = Layout;

const App = () => {
    return (
        <Layout>
            <Header style={{ color: 'white', fontSize: '24px' }}>Управление пользователями</Header>
            <Content style={{ padding: '20px' }}>
                <UserTable />
            </Content>
        </Layout>
    );
};

export default App;