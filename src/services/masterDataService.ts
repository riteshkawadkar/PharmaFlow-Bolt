// Master Data Service for PharmaFlow
// Handles equipment, applications, users, and other master data

export interface Equipment {
  id: string;
  name: string;
  type: 'analytical' | 'manufacturing' | 'packaging' | 'utility';
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  status: 'active' | 'maintenance' | 'retired' | 'validation';
  calibrationDue?: Date;
  qualificationStatus: 'qualified' | 'pending' | 'expired';
  lastQualified?: Date;
  nextQualification?: Date;
  specifications: Record<string, any>;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  name: string;
  type: 'lims' | 'erp' | 'mes' | 'qms' | 'dms' | 'chromatography';
  vendor: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance';
  apiEndpoint?: string;
  authMethod: 'none' | 'basic' | 'oauth' | 'api_key';
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  capabilities: string[];
  configuration: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MasterDataUser {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'pending';
  manager?: string;
  trainingRecords: TrainingRecord[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingRecord {
  id: string;
  courseId: string;
  courseName: string;
  completedAt: Date;
  expiresAt?: Date;
  score?: number;
  certificateUrl?: string;
  status: 'completed' | 'expired' | 'pending';
}

export interface ProductCode {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical';
  strength: string;
  unit: string;
  activeIngredients: string[];
  regulatoryStatus: 'approved' | 'pending' | 'withdrawn';
  specifications: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchLotNumber {
  id: string;
  batchNumber: string;
  lotNumber: string;
  productCode: string;
  manufacturingDate: Date;
  expiryDate: Date;
  quantity: number;
  unit: string;
  status: 'in_process' | 'released' | 'quarantine' | 'rejected';
  testResults: TestResult[];
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  testType: string;
  result: string;
  specification: string;
  status: 'pass' | 'fail' | 'pending';
  testedBy: string;
  testedAt: Date;
  equipment?: string;
}

// Mock data for demonstration
const mockEquipment: Equipment[] = [
  {
    id: 'EQ-HPLC-001',
    name: 'HPLC System 1',
    type: 'analytical',
    model: 'Agilent 1260 Infinity',
    manufacturer: 'Agilent Technologies',
    serialNumber: 'AG1260-001',
    location: 'QC Lab - Room 101',
    status: 'active',
    calibrationDue: new Date('2025-03-15'),
    qualificationStatus: 'qualified',
    lastQualified: new Date('2024-03-15'),
    nextQualification: new Date('2025-03-15'),
    specifications: {
      flowRate: '0.1-5.0 mL/min',
      pressure: 'up to 600 bar',
      temperature: '4-80°C'
    },
    documents: ['IQ-HPLC-001', 'OQ-HPLC-001', 'PQ-HPLC-001'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: 'EQ-TABLET-001',
    name: 'Tablet Press Line 1',
    type: 'manufacturing',
    model: 'Korsch XL400',
    manufacturer: 'Korsch AG',
    serialNumber: 'KO400-002',
    location: 'Manufacturing - Line 1',
    status: 'maintenance',
    qualificationStatus: 'pending',
    specifications: {
      maxPressure: '400 kN',
      tabletDiameter: '3-25 mm',
      productionRate: 'up to 400,000 tablets/hour'
    },
    documents: ['IQ-TP-002', 'OQ-TP-002'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2025-01-10')
  }
];

const mockApplications: Application[] = [
  {
    id: 'APP-LIMS-001',
    name: 'LabWare LIMS',
    type: 'lims',
    vendor: 'LabWare',
    version: '7.2.1',
    status: 'active',
    apiEndpoint: 'https://lims.pharmaflow.com/api/v1',
    authMethod: 'oauth',
    connectionStatus: 'connected',
    lastSync: new Date('2025-01-15T10:30:00'),
    capabilities: ['sample_management', 'test_results', 'coa_generation', 'stability_testing'],
    configuration: {
      syncInterval: 300,
      autoSync: true,
      dataMapping: {
        batchNumber: 'batch_id',
        testResults: 'results'
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: 'APP-ERP-001',
    name: 'SAP ERP',
    type: 'erp',
    vendor: 'SAP',
    version: 'S/4HANA 2023',
    status: 'active',
    apiEndpoint: 'https://erp.pharmaflow.com/sap/opu/odata/sap',
    authMethod: 'basic',
    connectionStatus: 'connected',
    lastSync: new Date('2025-01-15T09:45:00'),
    capabilities: ['inventory_management', 'production_orders', 'quality_notifications'],
    configuration: {
      client: '100',
      language: 'EN'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-14')
  }
];

const mockUsers: MasterDataUser[] = [
  {
    id: 'user-001',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@pharmaflow.com',
    department: 'Quality Control',
    role: 'QC Manager',
    permissions: ['qc_review', 'batch_release', 'user_management'],
    status: 'active',
    manager: 'user-005',
    trainingRecords: [
      {
        id: 'tr-001',
        courseId: 'GMP-101',
        courseName: 'Good Manufacturing Practices',
        completedAt: new Date('2024-06-15'),
        expiresAt: new Date('2025-06-15'),
        score: 95,
        status: 'completed'
      }
    ],
    lastLogin: new Date('2025-01-15T08:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15')
  }
];

const mockProductCodes: ProductCode[] = [
  {
    id: 'PC-ASP325',
    code: 'ASP325',
    name: 'Aspirin 325mg Tablets',
    description: 'Aspirin 325mg immediate release tablets',
    category: 'tablet',
    strength: '325',
    unit: 'mg',
    activeIngredients: ['Aspirin'],
    regulatoryStatus: 'approved',
    specifications: {
      assay: '95.0-105.0%',
      dissolution: 'NLT 80% in 30 minutes',
      uniformity: 'AV ≤ 15.0'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01')
  }
];

// Service class for master data operations
export class MasterDataService {
  private static instance: MasterDataService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, Date> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): MasterDataService {
    if (!MasterDataService.instance) {
      MasterDataService.instance = new MasterDataService();
    }
    return MasterDataService.instance;
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? expiry > new Date() : false;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, new Date(Date.now() + this.CACHE_DURATION));
  }

  // Equipment operations
  async getEquipment(filters?: { type?: string; status?: string; location?: string }): Promise<Equipment[]> {
    const cacheKey = `equipment_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let equipment = [...mockEquipment];
    
    if (filters) {
      if (filters.type) {
        equipment = equipment.filter(eq => eq.type === filters.type);
      }
      if (filters.status) {
        equipment = equipment.filter(eq => eq.status === filters.status);
      }
      if (filters.location) {
        equipment = equipment.filter(eq => eq.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
    }

    this.setCache(cacheKey, equipment);
    return equipment;
  }

  async getEquipmentById(id: string): Promise<Equipment | null> {
    const cacheKey = `equipment_${id}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const equipment = mockEquipment.find(eq => eq.id === id) || null;
    this.setCache(cacheKey, equipment);
    return equipment;
  }

  // Application operations
  async getApplications(filters?: { type?: string; status?: string }): Promise<Application[]> {
    const cacheKey = `applications_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let applications = [...mockApplications];
    
    if (filters) {
      if (filters.type) {
        applications = applications.filter(app => app.type === filters.type);
      }
      if (filters.status) {
        applications = applications.filter(app => app.status === filters.status);
      }
    }

    this.setCache(cacheKey, applications);
    return applications;
  }

  // User operations
  async getUsers(filters?: { department?: string; role?: string; status?: string }): Promise<MasterDataUser[]> {
    const cacheKey = `users_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let users = [...mockUsers];
    
    if (filters) {
      if (filters.department) {
        users = users.filter(user => user.department === filters.department);
      }
      if (filters.role) {
        users = users.filter(user => user.role === filters.role);
      }
      if (filters.status) {
        users = users.filter(user => user.status === filters.status);
      }
    }

    this.setCache(cacheKey, users);
    return users;
  }

  // Product code operations
  async getProductCodes(search?: string): Promise<ProductCode[]> {
    const cacheKey = `product_codes_${search || 'all'}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let products = [...mockProductCodes];
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.code.toLowerCase().includes(searchLower) ||
        product.name.toLowerCase().includes(searchLower)
      );
    }

    this.setCache(cacheKey, products);
    return products;
  }

  // Batch/Lot number validation
  async validateBatchNumber(batchNumber: string, productCode?: string): Promise<{ isValid: boolean; message: string; data?: BatchLotNumber }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock validation logic
    if (!batchNumber || batchNumber.length < 3) {
      return {
        isValid: false,
        message: 'Batch number must be at least 3 characters long'
      };
    }

    if (batchNumber.startsWith('ASP-')) {
      return {
        isValid: true,
        message: 'Valid batch number',
        data: {
          id: 'batch-001',
          batchNumber,
          lotNumber: `LOT-${batchNumber}`,
          productCode: productCode || 'ASP325',
          manufacturingDate: new Date('2025-01-10'),
          expiryDate: new Date('2027-01-10'),
          quantity: 100000,
          unit: 'tablets',
          status: 'in_process',
          testResults: [],
          createdAt: new Date('2025-01-10'),
          updatedAt: new Date('2025-01-15')
        }
      };
    }

    return {
      isValid: false,
      message: 'Batch number format not recognized'
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}