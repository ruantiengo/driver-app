import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';
import { Car } from '../carModel';
import { carRepository } from '../carRepository';
import { carService } from '../carService';
import { CreateCarDTO } from '../dto/createCarDto';


vi.mock('@/routes/car/carRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('carService', () => {
  const mockCars: Car[] = [
    { id: 1, brand: '', color: '', plate: '' },
    { id: 2, brand: '', color: '', plate: '' },
  ];

  describe('findAll', () => {
    it('return all cars', async () => {  
      (carRepository.findAll as Mock).mockReturnValue(mockCars); 
      const result = await carService.findAll();
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Cars found');
      expect(result.responseObject).toEqual(mockCars);
    });

    it('returns a not found error for no cars found', async () => {
      (carRepository.findAll as Mock).mockReturnValue(null);
      const result = await carService.findAll();

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No Cars found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAll', async () => {
     
      (carRepository.findAll as Mock).mockRejectedValue(new Error('Database error'));
      const result = await carService.findAll();
   
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding all cars');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns a car for a valid ID', async () => {

      const testId = 1;
      const mockCar = mockCars.find((user) => user.id === testId);
      (carRepository.findById as Mock).mockReturnValue(mockCar);

      const result = await carService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Car found');
      expect(result.responseObject).toEqual(mockCar);
    });

    it('handles errors for findById', async () => {
 
      const testId = 1;
      (carRepository.findById as Mock).mockRejectedValue(new Error('Database error'));

      const result = await carService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error finding car with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      const testId = 1;
      (carRepository.findById as Mock).mockReturnValue(null);

      const result = await carService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Car not found');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('Delete', () => {
    it('delete a car for a valid ID', async () => {

      const testId = 1;
      (carRepository.delete as Mock).mockReturnValue(null);

      const result = await carService.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Car deleted');
      
    });

    it('handles errors for delete', async () => {
 
      const testId = 1;
      (carRepository.delete as Mock).mockRejectedValue(new Error('Database error'));

      const result = await carService.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error for deleting a car:`);
      expect(result.responseObject).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a car and return a successful response', async () => {
      const mockCar = { id: 1, brand: 'Test Brand', color: 'Test Color', plate: 'ABC123' };
      
      const mockCreateCarDTO: CreateCarDTO = { brand: mockCar.brand, color: mockCar.color, plate: mockCar.plate };
      (carRepository.create as Mock).mockResolvedValue(mockCar);

      const result = await carService.create(mockCreateCarDTO);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Car created');
      expect(result.responseObject).toEqual(mockCar);
    });

    it('should return error when a car with new plate already exists', async () => {
      
      const mockCar = { id: 1, brand: 'Test Brand', color: 'Test Color', plate: 'ABC-1234' };
      const mockCreateCarDTO: CreateCarDTO = { brand: mockCar.brand, color: mockCar.color, plate: mockCar.plate };
      (carRepository.findByPlate as Mock).mockResolvedValue(mockCar);

      const result = await carService.create(mockCreateCarDTO);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Car with this plate already exists');
      expect(result.responseObject).toBeNull()
    });

    it('should handle errors during creation and return an error response', async () => {
      const mockError = new Error('Database error');
      const mockCreateCarDTO: CreateCarDTO = { brand: 'Test Brand', color: 'Test Color', plate: 'ABC-1234' };
      (carRepository.findByPlate as Mock).mockReturnValue(null);

      (carRepository.create as Mock).mockRejectedValue(mockError);

      const result = await carService.create(mockCreateCarDTO);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error for creating a car:');
      expect(result.responseObject).toBeNull();
    });
  });
});
