import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const RankingTable = ({ data }) => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map((row, index) => (
                <TableRow key={row.Name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.Name || row.G_Name}</TableCell>
                    <TableCell>{row.Resets || row.MasterPoint || row.PCPoint || row.G_Score}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default RankingTable;