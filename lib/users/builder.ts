export class UserBuilder {
  private userData: any = {};

  setBasicInfo(email: string, name: string) {
    this.userData.email = email;
    this.userData.name = name;
    return this;
  }

  setMetrics(age: number, sex: string, weight: number, height: number) {
    this.userData.age = age;
    this.userData.sex = sex;
    this.userData.weight = weight;
    this.userData.height = height;
    return this;
  }

  setGoals(goal: string, activityLevel: string) {
    this.userData.goal = goal;
    this.userData.activityLevel = activityLevel;
    return this;
  }

  setCalculations(bmr: number, tdee: number, calorieTarget: number) {
    this.userData.bmr = bmr;
    this.userData.tdee = tdee;
    this.userData.calorieTarget = calorieTarget;
    return this;
  }

  build() {
    return this.userData;
  }
}
