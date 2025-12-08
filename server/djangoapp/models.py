
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator



# Create a Car Make model `class CarMake(models.Model)`:
# - Name
# - Description
# - Any other fields you would like to include in car make model
# - __str__ method to print a car make object

class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.name} \n {self.description}"


# Create a Car Model model `class CarModel(models.Model):`:
# - Many-To-One relationship to Car Make model (One Car Make has many
#   Car Models, using ForeignKey field)
# - Name
# - Type (CharField with a choices argument to provide limited choices
#   such as Sedan, SUV, WAGON, etc.)
# - Year (IntegerField) with min value 2015 and max value 2023
# - Any other fields that desearve to be included in car model
# - __str__ method to print a car make object

class CarModel(models.Model):
    CAR_TYPE_CHOICES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('HATCHBACK', 'Hatchback'),
        ('CONVERTIBLE', 'Convertible'),
    ]
    dealer_id = models.IntegerField(null=True, blank=True)
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(
                            max_length=50,
                            choices=CAR_TYPE_CHOICES
                            )
    year = models.IntegerField(
                                validators=[
                                            MinValueValidator(2015),
                                            MaxValueValidator(2023)
                                            ]
                                )

    # Other field
    price = models.DecimalField(
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True
                                )
    mileage = models.PositiveIntegerField(
                                            null=True,
                                            blank=True
                                        )

    def __str__(self):
        return (
                f"{self.year} {self.car_make.name} "
                f"{self.name} {self.get_type_display()}"
                )
