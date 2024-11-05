
import React, { useEffect, useState } from 'react';
import { Table, notification, Popconfirm } from 'antd';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
            render: (text, record) => (
                <Popconfirm
                    title="Вы уверены, что хотите удалить этого пользователя?"
                    onConfirm={() => deleteUser (record.id, record.first_name, record.last_name)}
                    okText="Да"
                    cancelText="Нет"
                >
                    <a href="#">Удалить</a>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 3 }}
        />
    );
};

export {UserTable};
