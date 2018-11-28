import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { LocationsCache } from '../State';
import { Location } from '../models/Entity';
import { Link } from 'react-router-dom';

export type Props = {
  cache: LocationsCache;
  onInit(): void;
};

/**
 * Locations component.
 * Input locations.
 * Output
 *   onInit()
 *   onClick(index).
 */
export function Locations({ cache, onInit }: Props) {
  onInit();
  const isFetching = cache.isFetching;
  const locations = cache.locations;

  if (!locations) {
    return (
      <h2>Carregando...</h2>
    );
  } else {
    return (
      <Container>
        <h2>Empresas({locations.length})</h2>
        <p>
          Clique sobre uma linha para abrir as transações da empresa desejada.
        </p>
        <ListGroup style={{ opacity: (isFetching ? 0.5 : 1) }}>
          {
            locations.map((location, index) =>
              <ListGroupItem key={index}>
                <Link to={`/transactions?companyLocation=${location.code}`}>
                  <Row>
                    <Col md="3">{location.email}</Col>
                    <Col md="3">{location.federalTaxId}</Col>
                    <Col md="3">{cityState(location)}</Col>
                    <Col md="3">{location.address.phone}</Col>
                  </Row>
                </Link>
              </ListGroupItem>
            )
          }
        </ListGroup>
      </Container>
    );
  }
}

function cityState(location: Location): string {
  const cityName = location.address.cityName;
  const state = location.address.state;
  if (cityName) {
    return `${cityName} - ${state}`;
  } else {
    return state;
  }
}
