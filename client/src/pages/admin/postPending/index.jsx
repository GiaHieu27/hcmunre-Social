import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { Box, colors, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ReportIcon from '@mui/icons-material/Report';

import { browseArticles, getTotalAnalyze } from '../../../apis/admin';
import { deletePost } from '../../../apis/post';
import PageHeader from '../../../components/admin/PageHeader';

import SearchToolbar from '../../../components/SearchToolBar';
import TooltipMUI from '../../../components/TooltipMUI';

function PostPending() {
  const { user, admin } = useSelector((state) => ({ ...state }));
  const fullName = `${admin.first_name} ${admin.last_name}`;

  const [postPending, setPostPending] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(9);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await getTotalAnalyze(user.token);
        console.log(res.postHasNotBeenApproved);
        setPostPending(
          res.postHasNotBeenApproved.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [user.token]);

  const handleBrowserPost = async (postId, fullName) => {
    const res = await browseArticles(postId, fullName, user.token);
    // console.log(res.posts);
    setPostPending(
      res.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const handleDeletePost = async (postId) => {
    const res = await deletePost(postId, user.token);
    if (res.status === 'ok') {
      const newPost = postPending.filter((item) => {
        return item._id !== postId;
      });
      setPostPending(newPost);
    }
  };

  let columns = [
    {
      field: 'full_name',
      headerName: 'Ng?????i ????ng b??i',
      renderCell: (params) => {
        return (
          <Typography
            variant='body2'
            sx={{
              fontWeight: '500',
            }}
          >
            {params.value}
          </Typography>
        );
      },
      width: 180,
    },
    {
      field: 'type',
      headerName: 'Lo???i b??i vi???t',
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              padding: '5px 5px 2px 5px',
              backgroundColor:
                params.value === 'profilePicture'
                  ? colors.blue[50]
                  : params.value === 'cover'
                  ? colors.deepPurple[50]
                  : params.value === null &&
                    params?.row.images === null &&
                    params?.row.videos === null
                  ? colors.green[50]
                  : colors.red[50],
            }}
            color={
              params.value === 'profilePicture'
                ? colors.blue.A700
                : params.value === 'cover'
                ? colors.deepPurple.A700
                : params.value === null &&
                  params?.row.images === null &&
                  params?.row.videos === null
                ? colors.green.A700
                : colors.red.A700
            }
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: '500',
                marginBottom: '0px',
              }}
            >
              {params.value === 'profilePicture'
                ? '???nh ?????i di???n'
                : params.value === 'cover'
                ? '???nh b??a'
                : params.value === null &&
                  params?.row.images === null &&
                  params?.row.videos === null
                ? 'B??i vi???t'
                : 'Media'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'approve',
      headerName: 'Tr???ng th??i',
      width: 170,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            color={!params.value ? 'red' : 'green'}
          >
            {!params.value ? <ReportIcon /> : <VerifiedUserIcon />}

            <Typography
              variant='body2'
              sx={{
                marginLeft: '5px',
                fontWeight: '500',
              }}
            >
              {!params.value ? 'Ch??? duy???t' : '???? duy???t'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Th???i gian ????ng',
      flex: 1,
      renderCell: (params) =>
        moment(params.value).format('DD-MM-YYYY HH:mm:ss'),
    },
    {
      field: '_id',
      headerName: 'H??nh ?????ng',
      width: 150,
      renderCell: (params) => (
        <>
          <TooltipMUI title='Duy???t b??i' placement='top'>
            <IconButton
              aria-label='check'
              color='successCustom'
              onClick={() => handleBrowserPost(params.value, fullName)}
            >
              <DoneIcon />
            </IconButton>
          </TooltipMUI>

          <TooltipMUI title='Xo?? b??i' placement='top'>
            <IconButton
              aria-label='delete'
              color='error'
              onClick={() => handleDeletePost(params.value)}
            >
              <DeleteIcon />
            </IconButton>
          </TooltipMUI>

          <TooltipMUI title='Chi ti???t' placement='top'>
            <IconButton
              aria-label='detail'
              color='primary'
              component={Link}
              to={`/admin/post-pending/${params.value}`}
            >
              <OpenInNewOutlinedIcon />
            </IconButton>
          </TooltipMUI>
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <PageHeader title={'Danh s??ch b??i vi???t'} />

      <Paper>
        <DataGrid
          autoHeight
          getRowId={(r) => r._id}
          rows={postPending}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[9, 50, 100]}
          onPageSizeChange={(size) => setPageSize(size)}
          checkboxSelection
          showCellRightBorder
          showColumnRightBorder
          disableSelectionOnClick
          components={{ Toolbar: SearchToolbar }}
        />
      </Paper>
    </Box>
  );
}

export default PostPending;
