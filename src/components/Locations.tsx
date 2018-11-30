import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Row, Col, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { LocationsCache } from '../State';
import { Link } from 'react-router-dom';
import { cityState } from './cityState';

export type Props = {
  cache: LocationsCache;
  onInit(): void;
};

/**
 * Locations component.
 * Input locations cache.
 * Output onInit() called at the start.
 */
export function Locations({ cache, onInit }: Props) {
  onInit();
  const locations = cache.locations;
  const error = cache.error;

  if (locations) {
    return (
      <Container>
        <Breadcrumb>
          <BreadcrumbItem active>Empresas</BreadcrumbItem>
        </Breadcrumb>
        <h2>Empresas({locations.length})</h2>
        <p>
          Clique sobre uma linha para abrir as transações da empresa desejada.
        </p>
        <ListGroup style={{ opacity: (cache.isFetching ? 0.5 : 1) }}>
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
  } else if (error) {
    return (
      <Alert color="danger">
        <h2>Erro</h2>
        <p>{error.message}</p>
      </Alert>
    );
  } else {
    return (
      <Alert color="primary">
        <h2>Carregando...</h2>;
      </Alert>
    );
  }
}
