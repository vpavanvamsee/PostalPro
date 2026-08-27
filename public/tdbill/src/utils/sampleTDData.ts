import { OfficeProfile, TDAccountItem } from '../types';
import { calculateIncentive } from './tdRules';

export const DEFAULT_OFFICE_PROFILE: OfficeProfile = {
  bpmName: 'vamsee',
  designation: 'BPM',
  employeeId: '50****43',
  mobile: '630*****53',
  boName: 'vadlamudi',
  soName: 'sjmudi',
  hoName: 'tenali',
  divisionName: 'tenali',
  pincode: '522201'
};

export const INITIAL_SAMPLE_ACCOUNTS: TDAccountItem[] = [
  {
    id: 'td-acc-1',
    accountNumber: '302489104512',
    prNumber: 'PR-8921',
    depositorName: 'M. Venkata Lakshmi',
    depositDate: '2026-08-04',
    term: '5Y',
    depositAmount: 50000,
    incentiveRate: 2.0,
    incentiveAmount: calculateIncentive(50000, '5Y'),
    remarks: '5Y TD Max Deposit',
    createdAt: new Date().toISOString()
  },
  {
    id: 'td-acc-2',
    accountNumber: '304918273645',
    prNumber: 'PR-8924',
    depositorName: 'G. Srinivasulu Naidu',
    depositDate: '2026-08-08',
    term: '3Y',
    depositAmount: 50000,
    incentiveRate: 1.0,
    incentiveAmount: calculateIncentive(50000, '3Y'),
    remarks: '3Y Senior Citizen TD',
    createdAt: new Date().toISOString()
  },
  {
    id: 'td-acc-3',
    accountNumber: '308912745631',
    prNumber: 'PR-8930',
    depositorName: 'B. Anasuya Devi',
    depositDate: '2026-08-14',
    term: '2Y',
    depositAmount: 40000,
    incentiveRate: 1.0,
    incentiveAmount: calculateIncentive(40000, '2Y'),
    remarks: '2Y Term Deposit',
    createdAt: new Date().toISOString()
  },
  {
    id: 'td-acc-4',
    accountNumber: '301982736450',
    prNumber: 'PR-8942',
    depositorName: 'P. Satyanarayana Murthy',
    depositDate: '2026-08-19',
    term: '1Y',
    depositAmount: 25000,
    incentiveRate: 0.5,
    incentiveAmount: calculateIncentive(25000, '1Y'),
    remarks: '1Y Term Deposit',
    createdAt: new Date().toISOString()
  }
];
