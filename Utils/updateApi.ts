export const updateOrderList = async (
  request: any,
  token: string,
  orderId: number,
  v3url?: string,
) => {
  const url = `https://${
    v3url ? v3url : process.env.VALID_USER_ACCOUNT_2
  }.groovepackerapi.com/orders/update_order_list.json`;
  try {
    const response = await request.post(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
      data: {
        id: orderId,
        var: 'status',
        value: 'awaiting',
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrderApi = async (
  request: any,
  token: string,
  orderId: number,
  tenantUrl: string,
) => {
  try {
    const response = await request
      .get(`https://${tenantUrl}.groovepackerapi.com/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: any) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Extract the order status from the response
        const orderStatus = data.order.basicinfo;
        return orderStatus;
      });

    return response;
  } catch (error) {
    console.error('Error updating order list:', error);
    throw error;
  }
};
