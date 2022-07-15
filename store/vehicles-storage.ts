// import { vehiclesStore } from './vehicles';
export const VEHICLE_DATA_KEY = 'vehicles';

const asyncLocalStorage = {
  setItem: async function (key, value) {
    await null;
    return localStorage.setItem(key, value)
  },
  getItem: async function (key) {
    await null;
    return localStorage.getItem(key)
  },
  removeItem: async function (key) {
    await null;
    return localStorage.removeItem(key)
  }
};

export const availableLocalStorage = async () => {
  const test = 'test';
  try {
    await asyncLocalStorage.setItem(test, test);
    await asyncLocalStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const saveVehicles = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      let oldVehicles: any = await asyncLocalStorage.getItem('vehicles')
      oldVehicles = oldVehicles ? JSON.parse(oldVehicles) : []

      let newVehicles;
      // remove duplicated vehicles
      oldVehicles.forEach((v, index) => {
        if (v.National_code === data.National_code) {
          oldVehicles.splice(index, 1);
        }
      });
      if (Object.keys(data).length) {
        newVehicles = [...new Set([...oldVehicles, data])];
      } else {
        newVehicles = []
      }
      await asyncLocalStorage?.setItem('active-vehicle', JSON.stringify(data));
      await asyncLocalStorage?.setItem('vehicles', JSON.stringify(newVehicles));
    }
  } catch (e) {
    console.log('localStorage error----', e)
  }
};

export const saveActiveVehicle = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem('active-vehicle');
      asyncLocalStorage?.setItem('active-vehicle', JSON.stringify(data));
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const clearVehicles = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      asyncLocalStorage?.setItem('vehicles', JSON.stringify([]));
      asyncLocalStorage?.setItem('active-vehicle', JSON.stringify({}));
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const getSavedVehiclesData = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      const vehicles = await asyncLocalStorage?.getItem('vehicles');
      return vehicles ? JSON.parse(vehicles) : []
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const getActiveVehicleData = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      const activeVehicle = await asyncLocalStorage?.getItem('active-vehicle');
      return activeVehicle ? JSON.parse(activeVehicle) : {}
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const removeVehicle = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      const activeVehicle = await getActiveVehicleData();
      const oldVehicles = await getSavedVehiclesData();
      await clearVehicles();

      const newVehicles = oldVehicles.filter(vehicle => {
        return vehicle.National_code !== data.National_code
      })
      Promise.all(newVehicles.map(async vehicle => {
        await saveVehicles(vehicle);
      }))
      if (activeVehicle.National_code !== data.National_code) await saveActiveVehicle(data);
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}
