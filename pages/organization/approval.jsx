import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptOrganization,
  getUnapprovedOrganizations,
  rejectOrganization,
} from './../../redux/slices/organizationSlice';
import Layout from './../../components/admin/Layout';
import OrganizationDetailModal from './../../components/modal/OrganizationDetailModal';
import Loader from './../../components/global/Loader';
import Pagination from './../../components/global/Pagination';

const OrganizationApproval = () => {
  const [openOrganizationDetailModal, setOpenOrganizationDetailModal] =
    useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [selectedOrganization, setSelectedOrganization] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();
  const { alert, auth, organization } = useSelector((state) => state);

  const handleClickDetail = (organization) => {
    setOpenOrganizationDetailModal(true);
    setSelectedOrganization(organization);
  };

  const handleAcceptOrg = (id) => {
    dispatch(acceptOrganization({ id, token: `${auth.accessToken}` }));
  };

  useEffect(() => {
    if (!auth.accessToken) {
      router.push('/login?r=organization/approval');
    } else {
      if (auth.user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [router, auth]);

  useEffect(() => {
    if (auth.accessToken) {
      dispatch(
        getUnapprovedOrganizations({ token: auth.accessToken, page: currPage })
      );
    }
  }, [dispatch, auth, currPage]);

  return (
    <>
      <Layout title="Organization Approval" pageTitle="Organization Approval">
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <>
            {/* v1 */}
            {organization.data.length === 0 && (
              <div className="text-white text-center bg-red-500 rounded-md py-3">
                There's no organization that needs approval yet.
              </div>
            )}
            {/* v2 */}
            {organization.data.length !== 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm bg-blue-600 text-white">
                        <th className="p-3">No</th>
                        <th>Organization Name</th>
                        <th>Organization Email</th>
                        <th>Industry Type</th>
                        <th>Created Date</th>
                        <th>Registered Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organization.data.map((item, idx) => (
                        <tr
                          key={item._id}
                          className="text-center bg-[#F9F9FF] text-sm"
                        >
                          <td className="p-3">{idx + 1}</td>
                          <td>{item.user.name}</td>
                          <td>{item.user.email}</td>
                          <td>{item.industryType}</td>
                          <td>
                            {new Date(item.createdDate).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => handleClickDetail(item)}
                              className="text-xs mr-3 text-white px-3 py-2 bg-blue-500 hover:bg-blue-600 transition-[background] rounded-md"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleAcceptOrg(item._id)}
                              className="bg-green-600 mr-3 hover:bg-green-700 transition-[background] rounded-md text-white px-3 text-xs py-2"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                dispatch(
                                  rejectOrganization({
                                    id: item._id,
                                    token: `${auth.accessToken}`,
                                  })
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 transition-[background[ rounded-md text-white px-3 py-2 text-xs"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {organization.totalPage > 1 && (
                  <Pagination
                    currPage={currPage}
                    setCurrPage={setCurrPage}
                    totalPage={organization.totalPage}
                  />
                )}
              </>
            )}
          </>
        )}
      </Layout>
      {Object.keys(selectedOrganization).length > 0 && (
        <OrganizationDetailModal
          openModal={openOrganizationDetailModal}
          setOpenModal={setOpenOrganizationDetailModal}
          selectedOrganization={selectedOrganization}
        />
      )}
    </>
  );
};

export default OrganizationApproval;
