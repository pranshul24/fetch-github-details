import React, { Component } from 'react';
import axios from 'axios';
import "antd/dist/antd.css";
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Table } from 'antd';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: "",
            user_public_repos_and_stars: [],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: 'Created',
                    dataIndex: 'created',
                    key: 'created',
                },
                {
                    title: 'Last Updated',
                    dataIndex: 'updated',
                    key: 'updated',
                },
                {
                    title: 'Fork',
                    dataIndex: 'fork',
                    key: 'fork',
                },
                {
                    title: 'Github Page',
                    dataIndex: 'page',
                    key: 'page',
                },
                {
                    title: 'Size',
                    dataIndex: 'size',
                    key: 'size',
                },
            ],

        };

        this.syncInput = this.syncInput.bind(this);
    }

    syncInput(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value,
            user: value,
            user_public_repos_and_stars: []
        });
        console.log(value);
        let public_repos_url = "https://api.github.com/users/";
        public_repos_url += value;
        public_repos_url += "/repos"
        this.repos = [];
        this.stars = [];
        axios({
            method: "GET",
            url: public_repos_url,
        }).then((response) => {
            console.log(response['data']);
            for (let i = 0; i < response['data'].length; i++) {
                let isFork = "Yes";
                if (response['data'][i]['fork'] === false) {
                    isFork = "No";
                }
                let hasPage = "Yes";
                if (response['data'][i]['has_pages'] === false) {
                    hasPage = "No";
                }
                this.repos.push({
                    key: i + 1,
                    name: response['data'][i]['name'],
                    type: "Repo",
                    created: response['data'][i]['created_at'],
                    updated: response['data'][i]['updated_at'],
                    fork: isFork,
                    page: hasPage,
                    size: response['data'][i]['size'],
                });
                this.setState({
                    user_public_repos_and_stars: this.repos
                });
            }
        }).catch(err => {
            if (err) {
                console.log(err);
            }
        });

        let stars_url = "https://api.github.com/users/";
        stars_url += value;
        stars_url += "/starred"

        axios({
            method: "GET",
            url: stars_url,
        }).then((response) => {
            const sz = this.state.user_public_repos_and_stars.length;
            console.log(response['data']);

            for (let i = 0; i < response['data'].length; i++) {
                let isFork = "Yes";
                if (response['data'][i]['fork'] === false) {
                    isFork = "No";
                }
                let hasPage = "Yes";
                if (response['data'][i]['has_pages'] === false) {
                    hasPage = "No";
                }
                this.stars.push({
                    key: i + 1 + sz,
                    name: response['data'][i]['name'],
                    type: "Star",
                    created: response['data'][i]['created_at'],
                    updated: response['data'][i]['updated_at'],
                    fork: isFork,
                    page: hasPage,
                    size: response['data'][i]['size'],
                });
                this.ttt = this.repos.concat(this.stars)
                this.setState({
                    user_public_repos_and_stars: this.ttt
                });
            }
        }).catch(err => {
            if (err) {
                console.log(err);
            }
        });


    }

    render() {
        return (

            <div style={{
                display: 'block', width: 700, padding: 30
            }}>
                <Input placeholder="Enter username" prefix={<UserOutlined />}
                    onChange={this.syncInput}
                />
                <Table dataSource={this.state.user_public_repos_and_stars} columns={this.state.columns} />
            </div>
        );
    }
}

export default Main;