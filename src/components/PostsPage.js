import React, { useState, useEffect } from 'react';
import { Table, Select, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Option } = Select;

const PostsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, [location.search]);

  // fetching the data
  const fetchData = async () => {
    try {
      const skip = (pagination.current - 1) * pagination.pageSize;
      const limit = pagination.pageSize;
      const url = `https://dummyjson.com/posts?skip=${skip}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPosts(data.posts);
      console.log(data)
      setPagination(prevPagination => ({
        ...prevPagination,
        total: data.total // Assuming the response includes a totalCount field
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('page', pagination.current);
    navigate(`?${newQueryParams.toString()}`);
  };

  const handleTagChange = (selectedTags) => {
    setFilters(selectedTags);
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('tags', selectedTags.join(','));
    navigate(`?${newQueryParams.toString()}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('search', value);
    navigate(`?${newQueryParams.toString()}`);
  };

  const filteredPosts = posts.filter(post => {
    const tagMatches = filters.length === 0 || filters.every(filter => post.tags.includes(filter));
    const textMatches = searchText === '' || post.body.toLowerCase().includes(searchText.toLowerCase());
    return tagMatches && textMatches;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Input.Search
        placeholder="Search posts"
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: '10px' }}
      />
      <Select
        mode="multiple"
        placeholder="Select tags"
        style={{ width: 200, marginBottom: '10px' }}
        onChange={handleTagChange}
        value={filters}
      >
        <Option value="history">history</Option>
        <Option value="crime">crime</Option>
        <Option value="mystery">mystery</Option>
      </Select>
      <Table
        dataSource={filteredPosts}
        columns={[
          { title: 'Title', dataIndex: 'title', key: 'title' },
          { title: 'Body', dataIndex: 'body', key: 'body' },
          { title: 'Tags', dataIndex: 'tags', key: 'tags', render: tags => tags.join(', ') }
        ]}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default PostsPage;
