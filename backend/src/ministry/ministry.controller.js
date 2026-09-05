import { ministryDepartments } from "../constants/ministryDepartments.js";

export const getMinistries = (req, res) => {
  try {
    const ministries = Object.entries(ministryDepartments).map(
      ([ministryName, departments]) => ({
        ministryName,
        departments: departments.map((dept) => ({
          name: dept.name,
        })),
      }),
    );
    // console.log(ministries);
    return res.status(200).json({
      success: true,
      data: ministries,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getDepartmentsByMinistry = (req, res) => {
  const { ministry } = req.params;

  const departments = ministryDepartments[ministry];
  console.log(departments);
  if (!departments) {
    return res.status(404).json({ message: "Ministry not found" });
  }

  return res.status(200).json(departments);
};
