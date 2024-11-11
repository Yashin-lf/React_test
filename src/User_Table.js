import React, { useEffect, useState } from 'react';
import { Table, notification, Popconfirm, Modal, Form, Input, Dropdown, Menu } from 'antd';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser , setSelectedUser ] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://reqres.in/api/users');
            setUsers(response.data.data);
            notification.success({
                message: 'Получение списка пользователей',
                description: 'Данные пользователей успешно получены',
            });
        } catch (error) {
            notification.error({
                message: 'Ошибка получения списка пользователей',
                description: 'Не удалось получить данные пользователей. Проверьте подключение к сети.',
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteUser  = async (id, firstName, lastName) => {
        try {
            await axios.delete(`https://reqres.in/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            notification.success({
                message: 'Удаление пользователя',
                description: `Пользователь ${firstName} ${lastName} удален`,
            });
        } catch (error) {
            notification.error({
                message: 'Ошибка удаления пользователя',
                description: 'Не удалось удалить пользователя. Попробуйте еще раз.',
            });
        }
    };

    const showEditModal = (user) => {
        setSelectedUser (user);
        form.setFieldsValue({ first_name: user.first_name, last_name: user.last_name });
        setIsEditModalVisible(true);
    };

    const handleEditUser  = async () => {
        const values = await form.validateFields();
        try {
           
            setUsers(users.map(user => user.id === selectedUser .id ? { ...user, ...values } : user));
            notification.success({
                message: 'Редактирование пользователя',
                description: `Пользователь ${selectedUser .first_name} ${selectedUser .last_name} обновлен`,
            });
            setIsEditModalVisible(false);
        } catch (error) {
            notification.error({
                message: 'Ошибка редактирования пользователя',
                description: 'Не удалось обновить данные пользователя. Попробуйте еще раз.',
            });
        }
    };

    const handleMenuClick = (e) => {
        const { key } = e;
        if (key === 'edit') {
            showEditModal(selectedUser );
        } else if (key === 'delete') {
            deleteUser (selectedUser .id, selectedUser .first_name, selectedUser .last_name);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Имя',
            dataIndex: 'first_name',
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
        },
        {
            title: 'Фамилия',
            dataIndex: 'last_name',
            sorter: (a, b) => a.last_name.localeCompare(b.last_name),
        },
        {
            title: 'Действие',
            render: (text, record) => {
                const menu = (
                    <Menu onClick={handleMenuClick}>
                        <Menu.Item key="edit">Редактировать</Menu.Item>
                        <Menu.Item key="delete">Удалить</Menu.Item>
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a onClick={e => e.preventDefault()}>Действия</a>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 3 }}
                onRow={(record) => ({
                    onClick: () => setSelectedUser (record), // Устанавливаем выбранного пользователя при клике на строку
                })}
            />
            <Modal
                title="Редактировать пользователя"
                visible={isEditModalVisible}
                onOk={handleEditUser }
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="first_name"
                        label="Имя"
                        rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Фамилия"
                        rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export { UserTable };
