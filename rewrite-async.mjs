import fs from 'fs';

const pages = [
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Admin.tsx',
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Dashboard.tsx',
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Billing.tsx',
  'c:/Users/David/Desktop/FIRSTRANK/Website-Mirror/src/pages/Tracking.tsx'
];

pages.forEach(path => {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  // Async function signatures
  content = content.replace(/const handleSubmit = \(e: React\.FormEvent\) =>/g, 'const handleSubmit = async (e: React.FormEvent) =>');
  content = content.replace(/const handleDelete = \(id: string\) =>/g, 'const handleDelete = async (id: string) =>');
  content = content.replace(/const handleStatusChange = \(e: React\.ChangeEvent<HTMLSelectElement>, id: string\) =>/g, 'const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) =>');
  content = content.replace(/const handleApproveDeposit = \(dep: Deposit\) =>/g, 'const handleApproveDeposit = async (dep: Deposit) =>');
  content = content.replace(/const handleRejectDeposit = \(dep: Deposit\) =>/g, 'const handleRejectDeposit = async (dep: Deposit) =>');
  content = content.replace(/const saveSettings = \(\) =>/g, 'const saveSettings = async () =>');
  content = content.replace(/const approveUser = \(user: RegisteredUser\) =>/g, 'const approveUser = async (user: RegisteredUser) =>');
  content = content.replace(/const declineUser = \(user: RegisteredUser\) =>/g, 'const declineUser = async (user: RegisteredUser) =>');
  content = content.replace(/const payBill = \(bill: Bill\) =>/g, 'const payBill = async (bill: Bill) =>');
  content = content.replace(/const handleApproveReschedule = \(shipmentId: string\) =>/g, 'const handleApproveReschedule = async (shipmentId: string) =>');
  content = content.replace(/const handleRejectReschedule = \(shipmentId: string\) =>/g, 'const handleRejectReschedule = async (shipmentId: string) =>');
  content = content.replace(/const handleAddWaypoint = \(shipmentId: string\) =>/g, 'const handleAddWaypoint = async (shipmentId: string) =>');
  content = content.replace(/const reload = useCallback\(\(\) => {/g, 'const reload = useCallback(async () => {');
  
  // Specific Admin.tsx refreshers
  content = content.replace(/const refreshShipments = \(\) => setShipments\(getShipments\(\)\);/g, 'const refreshShipments = async () => setShipments(await getShipments());');
  content = content.replace(/const refreshUsers = \(\) => setUsers\(getRegisteredUsers\(\)\);/g, 'const refreshUsers = async () => setUsers(await getRegisteredUsers());');
  content = content.replace(/const refreshBilling = \(\) => { setAllBills\(getBills\(\)\); setAllDeposits\(getDeposits\(\)\); setWallets\(getWalletAddresses\(\)\); };/g, 'const refreshBilling = async () => { setAllBills(await getBills()); setAllDeposits(await getDeposits()); setWallets(await getWalletAddresses()); };');

  // Pre-fix existing await functions so they don't get double-awaited
  const awaitFunctions = [
    'getShipments', 'getRegisteredUsers', 'getBills', 'getDeposits', 'getWalletAddresses',
    'saveShipment', 'deleteShipment', 'updateRegisteredUser', 'saveBill', 'deleteBill',
    'saveDeposit', 'setUserBalance', 'saveNotification', 'markAllNotificationsRead',
    'saveWalletAddresses', 'createShareLink', 'revokeShareLink', 'getUserBalance',
    'getShipmentsForUser', 'getFullUserAccount', 'getNotifications', 'getSharesBySender',
    'getAllNotifications', 'getUnreadCount'
  ];

  awaitFunctions.forEach(fn => {
    const regex = new RegExp(`(?<!await )\\b${fn}\\(`, 'g');
    content = content.replace(regex, `await ${fn}(`);
  });

  fs.writeFileSync(path, content, 'utf8');
});

console.log("Migration script applied.");
