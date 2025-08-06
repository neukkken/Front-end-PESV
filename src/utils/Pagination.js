export const getPaginatedUsers = (allUsers, currentPage, limit) => {
    const indexOfLastUser = currentPage * limit;
    const indexOfFirstUser = indexOfLastUser - limit;
    return allUsers.slice(indexOfFirstUser, indexOfLastUser);
};
