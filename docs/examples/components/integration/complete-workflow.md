# Complete Workflow Integration Example

This example demonstrates a complete CRUD workflow integrating tables, forms, and dialogs with proper state management and error handling.

## User Management Module

### Complete Implementation
```tsx
import { useTable, useDialog, useForm } from '@/hooks/common';
import { useUserManagement } from '@/hooks/features/users';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const UserManagement = () => {
  // Hook integrations
  const userManagement = useUserManagement();
  const createDialog = useDialog();
  const editDialog = useDialog();
  const deleteDialog = useDialog();
  
  // Table configuration
  const table = useTable<User>({
    data: userManagement.users,
    pagination: {
      enabled: true,
      pageSize: 10
    },
    sorting: {
      enabled: true,
      defaultSort: {
        field: 'name',
        direction: 'asc'
      }
    },
    selection: {
      enabled: true,
      type: 'multiple'
    },
    filter: {
      enabled: true
    }
  });

  // Form configuration
  const filterForm = useForm({
    initialValues: {
      search: '',
      status: [],
      role: []
    },
    onChange: (values) => {
      table.setFilter((user) => {
        if (values.search && !user.name.toLowerCase().includes(values.search.toLowerCase())) {
          return false;
        }
        if (values.status.length && !values.status.includes(user.status)) {
          return false;
        }
        if (values.role.length && !values.role.includes(user.role)) {
          return false;
        }
        return true;
      });
    }
  });

  // Action handlers
  const handleCreate = async (data: Omit<User, 'id'>) => {
    try {
      await userManagement.createUser(data);
      createDialog.close();
      table.refresh();
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: Partial<User>) => {
    try {
      await userManagement.updateUser(id, data);
      editDialog.close();
      table.refresh();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userManagement.deleteUser(id);
      deleteDialog.close();
      table.refresh();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        table.selectedRows.map(user => userManagement.deleteUser(user.id))
      );
      table.clearSelection();
      table.refresh();
    } catch (error) {
      console.error('Failed to delete users:', error);
      throw error;
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              name="search"
              label="Search Users"
              value={filterForm.values.search}
              onChange={filterForm.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button
              startIcon={<AddIcon />}
              onClick={createDialog.open}
              variant="contained"
            >
              Add User
            </Button>
          </Grid>
          {table.hasSelection && (
            <Grid item>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                color="error"
              >
                Delete Selected ({table.selectedRows.length})
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                name="status"
                value={filterForm.values.status}
                onChange={filterForm.handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                multiple
                name="role"
                value={filterForm.values.role}
                onChange={filterForm.handleChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              onClick={filterForm.resetForm}
              variant="outlined"
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={table.isAllSelected}
                  onChange={table.handleSelectAll}
                  indeterminate={table.hasPartialSelection}
                />
              </TableCell>
              {columns.map(column => (
                <TableCell
                  key={column.field}
                  onClick={() => table.handleSort(column.field)}
                >
                  {column.label}
                  {table.sortField === column.field && (
                    <SortIcon direction={table.sortDirection} />
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table.paginatedRows.map(user => (
              <TableRow key={user.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={table.isSelected(user.id)}
                    onChange={() => table.handleSelect(user.id)}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      editDialog.open();
                      editDialog.setData(user);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteDialog.open();
                      deleteDialog.setData(user);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={table.totalRows}
          page={table.page - 1}
          rowsPerPage={table.pageSize}
          onPageChange={(_, page) => table.setPage(page + 1)}
          onRowsPerPageChange={(e) => {
            table.setPageSize(parseInt(e.target.value, 10));
            table.setPage(1);
          }}
        />
      </Paper>

      {/* Create Dialog */}
      <UserFormDialog
        open={createDialog.isOpen}
        onClose={createDialog.close}
        onSubmit={handleCreate}
        title="Create User"
      />

      {/* Edit Dialog */}
      <UserFormDialog
        open={editDialog.isOpen}
        onClose={editDialog.close}
        onSubmit={(data) => handleUpdate(editDialog.data?.id, data)}
        title="Edit User"
        initialValues={editDialog.data}
      />

      {/* Delete Dialog */}
      <ConfirmationDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={() => handleDelete(deleteDialog.data?.id)}
        title="Delete User"
        content={`Are you sure you want to delete ${deleteDialog.data?.name}?`}
      />
    </div>
  );
};

// Supporting Components

const UserFormDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
  initialValues?: User;
}> = ({ open, onClose, onSubmit, title, initialValues }) => {
  const form = useForm({
    initialValues: initialValues || {
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.name) errors.name = 'Required';
      if (!values.email) errors.email = 'Required';
      return errors;
    },
    onSubmit
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={form.values.name}
                onChange={form.handleChange}
                error={!!form.errors.name}
                helperText={form.errors.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                value={form.values.email}
                onChange={form.handleChange}
                error={!!form.errors.email}
                helperText={form.errors.email}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={form.values.role}
                  onChange={form.handleChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.values.status}
                  onChange={form.handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

## Best Practices and Tips

### 1. State Management
- Keep component state organized and minimal
- Use hooks for complex state management
- Handle loading and error states properly

### 2. Performance
- Implement proper memoization
- Use pagination for large datasets
- Optimize re-renders

### 3. Error Handling
- Implement proper error boundaries
- Show meaningful error messages
- Handle edge cases

### 4. Testing
```tsx
describe('User Management', () => {
  it('should handle CRUD operations', async () => {
    const { getByText, getByLabelText } = render(<UserManagement />);
    
    // Create user
    await userEvent.click(getByText('Add User'));
    await userEvent.type(getByLabelText('Name'), 'John Doe');
    await userEvent.type(getByLabelText('Email'), 'john@example.com');
    await userEvent.click(getByText('Save'));
    
    // Verify user was created
    expect(getByText('John Doe')).toBeInTheDocument();
    
    // Update user
    await userEvent.click(getByTestId('edit-button'));
    await userEvent.type(getByLabelText('Name'), ' Updated');
    await userEvent.click(getByText('Save'));
    
    // Verify user was updated
    expect(getByText('John Doe Updated')).toBeInTheDocument();
    
    // Delete user
    await userEvent.click(getByTestId('delete-button'));
    await userEvent.click(getByText('Confirm'));
    
    // Verify user was deleted
    expect(queryByText('John Doe Updated')).not.toBeInTheDocument();
  });
});
