import { TYPE_Cars } from 'context/context-types'
import { useConfig } from 'context'
import BoxedCar from './boxed-car'
import PrimaryButton from '../buttons/primary-button'
import DecoratedTitle5 from 'components/titles/decorated-title-5'
import Styles from './latest-cars.module.css'

type LatastCarsProps = {
    id?: string
    cars: TYPE_Cars[]
    numberOfCars: number
}
const LatestCars = ({ id, cars, numberOfCars }: LatastCarsProps) => {
    const { setLoading } = useConfig()
    return (
        <div id={id} className={Styles.container}>
            <DecoratedTitle5 text={'Veículos'} />
            <div className={Styles.carContainer}>
                {
                    cars.map((car, index) => {
                        return (
                            index < numberOfCars && <BoxedCar theme="dark" key={car.title} car={car} />
                        )
                    })
                }
            </div>
            <div className={Styles.button}>
                <PrimaryButton label={'Todos os veículos'} onClick={() => setLoading(true)} link={'/car'}>Todos os veículos</PrimaryButton>
            </div>
        </div>
    )
}

export default LatestCars